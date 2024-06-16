import React, { useState, useRef, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
  Form,
  Input,
  Table,
  Drawer,
  Button,
  Select,
  TimePicker,
  Modal,
  message,
  Popconfirm,
} from 'antd';
import {
  addAddressTemplate,
  editAddressTemplate,
  fetchSubAddressTemplate,
  addSubAddressTemplate,
  editSubAddressTemplate,
  deleteAddressTemplate,
} from '../service';
import type { TemlateAddressTableItem, TableListPagination } from '../data.d';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateSubBuildingForm from './CreateSubBuildingForm'; // 确保路径正确

interface SubAddressTemplateFormProps {
  visible: boolean;
  onCancel: () => void;
  parentId?: number; // 确保传递 上级
}

interface SubBuildingFormValues {
  addressName: string;
  sort: number;
  id?: number; // 可选，因为新建时不需要ID
  parentId?: number; // 可选，因为新建时不需要ID
}

const SubAddressTemplateForm: React.FC<SubAddressTemplateFormProps> = ({
  visible,
  onCancel,
  parentId,
}) => {
  const actionRef = useRef<ActionType>();
  const [subModalVisible, setSubModalVisible] = useState(false);
  const [subCurrentRecord, setSubCurrentRecord] = useState<SubBuildingFormValues | null>(null);
  const [tableData, setTableData] = useState<TemlateAddressTableItem[]>([]); // 存储门牌列表的数据

  const handleCreate = async (values: SubBuildingFormValues) => {
    console.log('Form values:', values);
    const postData = { parentId: parentId, ...values };

    // 可以在这里添加提交到服务器的代码
    const response = await addSubAddressTemplate(postData);
    if (response && response.success) {
      message.success('门牌添加成功');
      setSubModalVisible(false); // 关闭模态框
      actionRef.current?.reload(); // 刷新ProTable
    } else {
      message.error('添加失败，请检查数据');
    }
    setSubModalVisible(false);
  };

  const handleEdit = (record: TemlateAddressTableItem) => {
    console.log('Setting current record for edit:', record);
    setSubCurrentRecord({
      addressName: record.addressName,
      sort: record.sort,
      id: record.id,
    });

    setSubModalVisible(true); // 打开编辑楼栋的模态框
  };

  // useEffect(() => {
  //   if (visible) {
  //     console.log('Fetching data for new parentId:', parentId);
  //     const fetchData = async () => {
  //       const response = await fetchSubAddressTemplate({
  //         pageSize: 10, // 假设的分页大小
  //         current: 1, // 始终从第一页开始
  //         parentId: parentId,
  //         pageNum: 1,
  //         source: 1,
  //       });
  //       if (response.success) {
  //         setTableData(response.data.list); // 更新表格数据状态
  //         return { success: true };
  //       } else {
  //         message.error('加载数据失败');
  //         return { success: false };
  //       }
  //     };

  //     fetchData();
  //   }
  // }, [parentId, visible]);

  useEffect(() => {
    if (subCurrentRecord) {
      console.log('ppine-Current record for edit:', subCurrentRecord);
      setSubModalVisible(true);
    }
  }, [subCurrentRecord]);

  const handleEditDone = async (values: TemlateAddressTableItem) => {
    console.log('Form values for edit:', values);
    const postData = { id: values.id, ...values };
    console.log('Form values for edit:', postData);
    // 可以在这里添加提交到服务器的代码
    const response = await editAddressTemplate(postData);
    if (response && response.success) {
      message.success('地址模板修改成功');
      setSubModalVisible(false); // 关闭模态框
      actionRef.current?.reload(); // 刷新ProTable
    } else {
      message.error('修改失败，请检查数据');
    }
    setSubModalVisible(false);
  };

  const handleSubDelete = async (record: TemlateAddressTableItem) => {
    Modal.confirm({
      title: '确定要删除这个门牌吗？',
      content: '删除后不可恢复',
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

  const columns: ProColumns<TemlateAddressTableItem>[] = [
    {
      title: '门牌名称',
      dataIndex: 'addressName',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a key="edit" onClick={() => handleEdit(record)}>
          编辑
        </a>,
        <a
          key="delete1"
          onClick={() => handleSubDelete(record)}
          style={{ color: 'red', marginLeft: 8 }}
        >
          删除
        </a>,
      ],
    },
  ];

  const subTableRequest = async (params?: { pageSize: number; current: number }) => {
    console.log(params, 'params');
    console.log(parentId, 'parentId');
    const res = await fetchSubAddressTemplate({
      ...params,
      parentId: parentId,
      pageNum: params?.current,
    });
    return { data: res.data?.list, success: true, total: res.data?.total };
  };

  // 在关闭Drawer的函数中
  const closeDrawer = () => {
    setSubModalVisible(false);
    setSubCurrentRecord(null); // 清除当前记录，确保下次打开时不会残留旧数据
  };

  const refreshSubAddressData = () => {
    const fetchData = async () => {
      const response = await fetchSubAddressTemplate({
        pageSize: 10, // 适当调整这些参数
        current: 1,
        parentId: parentId,
      });
      if (response.success) {
        setTableData(response.data.list);
      } else {
        message.error('加载门牌数据失败');
      }
    };
    fetchData();
  };

  return (
    <PageContainer>
      <ProTable<TemlateAddressTableItem, TableListPagination>
        actionRef={actionRef}
        rowKey="id"
        search={false} // 设置为 false 来禁用搜索功能
        toolBarRender={() => [
          <Button
            type="primary"
            key="createnew1"
            onClick={() => {
              setSubModalVisible(true); // 打开模态框
              //  setIsEdit(false); // 设置为非编辑模式
              setSubCurrentRecord(null); // 清空当前行记录，确保表单为空
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        //dataSource={tableData} // 直接使用状态管理数据
        request={subTableRequest}
        columns={columns}
        // rowSelection={{
        //   onChange: (_, selectedRows) => {
        //     console.log(selectedRows);
        //     // setSelectedRows(selectedRows);
        //   },
        // }}
      />

      <CreateSubBuildingForm
        visible={subModalVisible}
        onCreate={subCurrentRecord ? handleEditDone : handleCreate}
        onCancel={closeDrawer}
        onClose={closeDrawer} // 使用上面定义的closeDrawer函数
        initialValues={subCurrentRecord}
        onSuccess={() => actionRef.current?.reload()} // 传递一个刷新表格的回调函数
        actionRef={actionRef}
      />
    </PageContainer>
  );
};

export default SubAddressTemplateForm;
