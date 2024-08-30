import { CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, message, Modal, Switch } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { userMenuPageInfo, deleteKitchenLive, updateKitchenLiveStatus } from './service';
import type { TableListItem, TableListPagination } from './data';
import MergeForm from './components/MergeForm';
import { kitchenPageInfo } from '../../biz/KitchenManage/service';
import type { RequestOptionsType } from '@ant-design/pro-utils';

const tableRequest = async (params?: { pageSize: number; current: number }) => {
  const res = await userMenuPageInfo({
    ...params,
    pageNum: params?.current,
  });
  console.log(res.data);
  return { data: res.data?.list, success: true, total: res.data?.total };
};

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [mergeFormVisible, setMergeFormVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<any>();
  /** 国际化配置 */

  // 使用POST方法删除数据的函数
  const handleDelete = (record) => {
    Modal.confirm({
      title: '确定删除这条记录吗？',
      content: '删除后无法恢复，请确认！',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          const res = await deleteKitchenLive(record);
          message.success('删除成功');
          actionRef.current?.reload(); // 刷新表格数据
        } catch (error) {
          message.error('删除操作失败: ' + error.message);
        }
      },
    });
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '编码',
      dataIndex: 'code',
      hideInSearch: true,
    },
    {
      title: '名称',
      dataIndex: 'name',
      hideInSearch: true,
    },
    {
      title: '显示名称',
      dataIndex: 'showName',
      hideInSearch: true,
    },
    // {
    //   title: '厨房',
    //   dataIndex: 'kitchenId',
    //   valueType: 'select',
    //   hideInTable: true,
    //   request: kitchenSelectRequest,
    // },
    {
      title: '排序',
      dataIndex: 'sort',
      hideInSearch: true,
    },
    {
      title: '关联商品大类',
      dataIndex: 'cates',
      hideInSearch: true,
      render: (text, record) => {
        // 使用map来获取所有类的名称，并用逗号连接成一个字符串
        return record.cates.map((cate) => cate.className).join(', ');
      },
    },
    // {
    //   title: '状态',
    //   dataIndex: 'status',
    //   valueType: 'select', // 指定为下拉选择框
    //   valueEnum: {
    //     1: { text: '开启', status: 'Processing' },
    //     0: { text: '关闭', status: 'Default' },
    //   },
    //   render: (_, record) => (
    //     <Switch
    //       checkedChildren="开启"
    //       unCheckedChildren="关闭"
    //       checked={record.status === 1}
    //       onChange={(checked) => handleStatusChange(record, checked)}
    //     />
    //   ),
    // },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            setMergeFormVisible(true);
            setIsEdit(true);
            setCurrentRow(record);
            console.log(record);
          }}
        >
          编辑
        </a>,
        // <a key="delete" onClick={() => handleDelete(record)}>
        //   删除
        // </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        // headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          // <Button
          //   type="primary"
          //   key="primary"
          //   onClick={() => {
          //     setMergeFormVisible(true);
          //     setIsEdit(false);
          //     setCurrentRow(undefined);
          //   }}
          // >
          //   <PlusOutlined /> 新建
          // </Button>,
        ]}
        request={tableRequest}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            console.log(selectedRows);
            // setSelectedRows(selectedRows);
          },
        }}
      />

      <MergeForm
        visible={mergeFormVisible}
        onCancel={() => setMergeFormVisible(false)}
        value={currentRow}
        isEdit={isEdit}
        onSuccess={() => actionRef.current?.reload()}
      />
    </PageContainer>
  );
};

export default TableList;
