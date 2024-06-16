import React, { useState, useRef, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Form, Input, Table, Drawer, Button, Select, TimePicker, Modal, message } from 'antd';
import {
  fetchAddressTemplate,
  addAddressTemplate,
  editAddressTemplate,
  deleteAddressTemplate,
} from '../service';
import type { TemlateAddressTableItem, TableListPagination } from '../data.d';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateBuildingForm from './CreateBuildingForm'; // 确保路径正确
import SubAddressTemplateForm from './SubAddresstemplateForm'; // 确保路径正确

interface AddressTemplateFormProps {
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

const AddressTemplateForm: React.FC<AddressTemplateFormProps> = ({ visible, onCancel, areaId }) => {
  const actionRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [currentRecord, setCurrentRecord] = useState<BuildingFormValues | null>(null);
  const [subDrawerVisible, setSubDrawerVisible] = useState<boolean>(false); // 控制subDrawer的显示
  const [subKey, setSubKey] = useState(0);

  const handleCreate = async (values: BuildingFormValues) => {
    console.log('Form values:', values);
    const postData = { parentId: 0, areaId: areaId, ...values };

    // 可以在这里添加提交到服务器的代码
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

  useEffect(() => {
    console.log('currentRecord-------:', currentRecord);
    if (!subDrawerVisible && currentRecord && currentRecord.isEdit == false) {
      // 当Drawer关闭并且currentRecord更新后，重新打开Drawer
      setSubDrawerVisible(true);
    }
  }, [subDrawerVisible, currentRecord]);

  const handleEditDone = async (values: TemlateAddressTableItem) => {
    console.log('Form values for edit:', values);
    const postData = { id: values.id, ...values };
    console.log('Form values for edit:', postData);
    // 可以在这里添加提交到服务器的代码
    const response = await editAddressTemplate(postData);
    if (response && response.success) {
      message.success('地址模板修改成功');
      values.isEdit = false;
      setModalVisible(false); // 关闭模态框
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
    setSubDrawerVisible(true);
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

  const columns: ProColumns<TemlateAddressTableItem>[] = [
    {
      title: '楼栋名称',
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
          key="delete"
          onClick={() => handleDelete(record)}
          style={{ color: 'red', marginLeft: 8 }}
        >
          删除
        </a>,
        <a key="subAddressTemplate" onClick={() => handleSubAddressManagement(record)}>
          门牌管理
        </a>,
      ],
    },
  ];

  const tableRequest = async (params?: { pageSize: number; current: number }) => {
    console.log(params, 'params');
    console.log(areaId, 'areaId');
    const res = await fetchAddressTemplate({
      ...params,
      areaId: areaId,
      pageNum: params?.current,
    });
    return { data: res.data?.list, success: true, total: res.data?.total };
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
            key="createnew"
            onClick={() => {
              setModalVisible(true); // 打开模态框
              //  setIsEdit(false); // 设置为非编辑模式
              setCurrentRecord(null); // 清空当前行记录，确保表单为空
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={tableRequest}
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

      <Drawer
        title="门牌管理"
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

export default AddressTemplateForm;
