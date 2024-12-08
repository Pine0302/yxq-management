import React, { useState, useRef, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Form, Input, Table, Drawer, Button, Select, TimePicker, Modal, message } from 'antd';
import { ModalForm, ProFormText } from '@ant-design/pro-form';

import { InputNumber, Popconfirm } from 'antd';

import {
  fetchAreaGoodsTemplate,
  editAreaGoodsTemplate,
  addAddressTemplate,
  editAddressTemplate,
  deleteAddressTemplate,
  editAreaStock,
  downSell,
} from '../service';
import type {
  TemlateAddressTableItem,
  TableListPagination,
  TemlateAreaGoodsTableItem,
} from '../data';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateBuildingForm from './CreateBuildingForm'; // 确保路径正确
import SubAddressTemplateForm from './SubAddresstemplateForm'; // 确保路径正确
import EditAreaGoodsForm from './EditAreaGoodsForm'; // 确保路径正确
import { Stock } from '@ant-design/charts';

interface AreaGoodsTemplateFormProps {
  visible: boolean;
  onCancel: () => void;
  areaId?: number; // 确保传递 areaId
}

interface BuildingFormValues {
  addressName: string;
  sort: number;
  id?: number; // 可选，因为新建时不需要ID
  parentId?: number; // 可选，因为新建时不需要父ID
  areaId?: number; //
  isEdit?: boolean;
}

type DataItem = {
  id: number;
  gid: number;
  gname: string;
  total: number;
  sold: number;
  newStock: number;
};
const AreaGoodsTemplateForm: React.FC<AreaGoodsTemplateFormProps> = ({
  visible,
  onCancel,
  areaId,
}) => {
  const actionRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState(false);
  const [subModalVisible, setSubModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [currentRecord, setCurrentRecord] = useState<BuildingFormValues | null>(null);
  const [subDrawerVisible, setSubDrawerVisible] = useState<boolean>(false); // 控制subDrawer的显示
  const [subKey, setSubKey] = useState(0);
  const [ds, setDs] = useState<DataItem[]>([]);
  const [inputValue, setInputValue] = useState<number | null>(null);
  const setKitchenStock = async (kitchenGoodsId: number, newStock: number) => {
    return await editAreaStock({ id: kitchenGoodsId, stock: newStock });
  };

  const handleCreate = async (values: BuildingFormValues) => {
    console.log('Form values:', values);
    const postData = { parentId: 0, areaId: areaId, ...values };

    // 可以在这里添加提交到服器的代码
    const response = await addAddressTemplate(postData);
    if (response && response.success) {
      message.success('地址模板添加成功');
      setModalVisible(false); // 关闭模态框
      actionRef.current?.reload(); // 刷新ProTable
    } else {
      message.error('添加失败，请检查数据');
    }
    setModalVisible(false);
  };

  const handleEdit = (record: TemlateAddressTableItem) => {
    console.log('Setting current record for edit:', record);
    setCurrentRecord({
      addressName: record.addressName,
      sort: record.sort,
      id: record.id,
      isEdit: true,
    });
    setSubDrawerVisible(false); // 确保关闭任何已经打开的门牌管理Drawer
    setModalVisible(true); // 打开编辑楼栋的模态框
  };

  // 使用POST方法删除数据的函数
  const handleEnd = (record: any) => {
    Modal.confirm({
      title: '下架后商品将从用户侧隐藏，但不会影响正在交易中的商品（已付款的商品）',
      content: '确认下架该商品？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          const postData = { id: record.id, stock: record.total };
          const res = await downSell(postData);
          message.success('下架成功');
          actionRef.current?.reload(); // 刷新表格数据
        } catch (error) {
          message.error('下架操作失败: ' + error.message);
        }
      },
    });
  };

  useEffect(() => {
    console.log('currentRecord-------:', currentRecord);
    if (!subDrawerVisible && currentRecord && currentRecord.isEdit == false) {
      // 当Drawer关闭并且currentRecord更新后，重新打开Drawer
      setSubDrawerVisible(true);
    }
  }, [subDrawerVisible, currentRecord]);

  const handleEditDone = async (values: TemlateAddressTableItem) => {
    console.log('Form values for edit:', values);
    const postData = { id: values.id, status: true, ...values };
    console.log('Form values for edit:', postData);
    // 可以在这里添加提交到服务器的代码
    const response = await editAreaGoodsTemplate(postData);
    if (response && response.success) {
      message.success('楼宇商品更新成功');
      values.isEdit = false;
      setSubModalVisible(false); // 关闭模态框
      actionRef.current?.reload(); // 刷新ProTable
    } else {
      setModalVisible(true);
      message.error('修改失败，请检查数据');
    }
  };

  const handleSubAddressManagement = (record: TemlateAddressTableItem) => {
    console.log('Opening sub-address management for:', record);
    setModalVisible(false); // 确保关闭任何已经打开的编辑模态框
    setCurrentRecord(record); // 更新当前记录
    setSubModalVisible(true);
  };

  const handleDelete = async (record: TemlateAddressTableItem) => {
    Modal.confirm({
      title: '确定要删除这个地址模板吗？',
      content: '删除该地址模板同时会删除对应的门牌信息，请确认！',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        const postData = { id: record.id };

        const response = await deleteAddressTemplate(postData); // 假设这个函数已经在service文件中定义
        if (response && response.success) {
          message.success('删除成功');
          actionRef.current?.reload(); // 刷新表格数据
        } else {
          message.error('删除失败，请检查数据');
        }
      },
    });
  };

  const columns: ProColumns<TemlateAreaGoodsTableItem>[] = [
    {
      title: '商品名称',
      dataIndex: 'gname',
      search: {
        transform: (value) => ({ gname: value }), // 自定义检索字段
      },
    },
    {
      title: '已售',
      dataIndex: 'sellnum',
      search: false,
    },
    {
      title: '当前库存',
      dataIndex: 'total',
      search: false,
    },
    {
      title: '是否限购',
      dataIndex: 'limitBuy',
      render: (text, record) => (record.limitBuy ? '是' : '否'),
      valueEnum: {
        true: { text: '是' },
        false: { text: '否' },
      },
      search: false,
      // search: {
      //   transform: (value) => ({ originStatus: value }), // 自定义检索字段
      // },
    },
    {
      title: '限购数量',
      dataIndex: 'limitNum',
      search: false,
      render: (text, record) => (record.limitBuy ? text : '-'),
    },
    {
      title: '划线价格',
      dataIndex: 'originalPrice',
      search: false,
    },
    {
      title: '价格',
      dataIndex: 'price',
      search: false,
    },
    {
      title: '打包费',
      dataIndex: 'packageFee',
      search: false,
    },
    {
      title: '上/下架状态 ',
      dataIndex: 'status',
      render: (text, record) => {
        if (record.total === 0) {
          return '售罄';
        }
        return record.status === false ? '待上架' : '已上架';
      },
      valueEnum: {
        all: { text: '所有' },
        soldOut: { text: '售罄' },
        pending: { text: '待上架' },
        listed: { text: '已上架' },
      },
      search: {
        transform: (value) => {
          switch (value) {
            case 'soldOut':
              return { total: 0 };
            case 'pending':
              return { total: 2 };
            case 'listed':
              return { total: 1 };
            case 'all':
            default:
              return { total: -1 };
          }
        },
      },
    },
    {
      title: '商品归属',
      dataIndex: 'belong',
      valueEnum: {
        1: { text: '厨房' },
        2: { text: '楼宇' },
      },
      render: (_, record) => (record.belong === 1 ? '厨房' : '楼宇'),
      search: {
        transform: (value) => ({ belong: value }),
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        if (!record.originStatus) {
          // 商品是禁用状态，不允许任何操作
          return null;
        }

        if (record.status === false) {
          return [
            <a key="subAddressTemplate" onClick={() => handleSubAddressManagement(record)}>
              上架
            </a>,
          ];
        } else {
          return [
            <a key="edit" onClick={() => handleEnd(record)}>
              下架
            </a>,
            <Popconfirm
              key={`ppp- ${record.id}`}
              icon={<></>}
              title={
                <InputNumber
                  min={0}
                  value={inputValue ?? record.total} // 使用 inputValue 或 fallback 为 record.total
                  controls={true}
                  onChange={(value) => {
                    setInputValue(value); // 更新受控状态
                    const updatedData = ds.map((item) =>
                      item.id === record.id ? { ...item, total: value } : item,
                    );
                    setDs(updatedData);
                  }}
                />
              }
              onOpenChange={(open) => {
                if (open) {
                  // 当 Popconfirm 打开时，重置为当前 record.total
                  setInputValue(record.total);
                }
              }}
              onConfirm={async () => {
                const res = await setKitchenStock(record.id, inputValue); // 使用更新后的值
                if (res.code === 200) {
                  message.success('操作成功.');
                  setDs((prevDs) => {
                    return prevDs.map((item) =>
                      item.id === record.id ? { ...item, total: inputValue ?? record.total } : item,
                    );
                  });
                  actionRef.current?.reload(); // 强制刷新表格数据
                }
              }}
              okText="保存"
              cancelText="取消"
            >
              <a href="#">调库存</a>
            </Popconfirm>,
          ];
        }
      },
    },
  ];

  const tableRequest = async (params?: { pageSize: number; current: number }) => {
    console.log(params, 'params');
    console.log(areaId, 'areaId');
    const res = await fetchAreaGoodsTemplate({
      ...params,
      areaId: areaId,
      pageNum: params?.current,
    });
    return { data: res.data?.list, success: true, total: res.data?.total };
  };

  return (
    <PageContainer
    //header={{
    //title: false, // 隐藏标题
    //breadcrumb: undefined, // 隐藏面包屑
    //}}
    >
      <ProTable<TemlateAddressTableItem, TableListPagination>
        actionRef={actionRef}
        rowKey="id"
        //search={true} // 设置为 false 来禁用搜索功能
        toolBarRender={() => [
          <Button
            type="primary"
            key="createnew"
            onClick={() => {
              setModalVisible(true); // 打开模态框
              //  setIsEdit(false); // 设置为非编辑模式
              setCurrentRecord(null); // 清空当前行记录，确保表单为空
            }}
          >
            {/* <PlusOutlined /> 新建 */}
          </Button>,
        ]}
        request={tableRequest}
        //dataSource={ds}
        columns={columns}
        // rowSelection={{
        //   onChange: (_, selectedRows) => {
        //     console.log(selectedRows);
        //     // setSelectedRows(selectedRows);
        //   },
        // }}
      />

      <CreateBuildingForm
        visible={modalVisible}
        onCreate={currentRecord ? handleEditDone : handleCreate}
        onCancel={() => setModalVisible(false)}
        initialValues={currentRecord}
      />
      <EditAreaGoodsForm
        visible={subModalVisible}
        onCreate={currentRecord ? handleEditDone : handleCreate}
        onCancel={() => setSubModalVisible(false)}
        initialValues={currentRecord}
      />

      <Drawer
        title="楼宇商品管理1"
        width={720}
        onClose={() => {
          setSubDrawerVisible(false); // 关闭抽屉
          setCurrentRecord(null); // 清除当前记录
        }}
        visible={subDrawerVisible}
      >
        <SubAddressTemplateForm
          visible={subDrawerVisible}
          onCancel={() => {
            setSubDrawerVisible(false);
            setCurrentRecord(null); // 同样在取消时清除当前记录
          }}
          parentId={currentRecord?.id} // 确保传入正确的parentId
        />
      </Drawer>
    </PageContainer>
  );
};

export default AreaGoodsTemplateForm;
