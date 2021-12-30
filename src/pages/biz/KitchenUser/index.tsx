import { CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { kitchenUserPageInfo } from './service';
import type { KitchenUserTableItem, TableListPagination } from './data';
import MergeForm from './components/MergeForm';

const tableRequest = async (params?: { pageSize: number; current: number }) => {
  const res = await kitchenUserPageInfo({
    ...params,
    pageNum: params?.current,
  });

  return { data: res.data?.list, success: true, total: res.data?.total };
};

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [mergeFormVisible, setMergeFormVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<any>();
  /** 国际化配置 */

  const columns: ProColumns<KitchenUserTableItem>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
    },
    {
      title: '是否管理员',
      dataIndex: 'isAdmin',
      hideInSearch: true,
      render: (_, record) => (record.isAdmin ? <CheckOutlined /> : <CloseOutlined />),
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      hideInSearch: true,
      valueEnum: {
        0: {
          text: '禁用',
          status: 'Error',
        },
        1: {
          text: '正常',
          status: 'Success',
        },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'ctime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
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
        <a key="change_pwd">改密</a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<KitchenUserTableItem, TableListPagination>
        // headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setMergeFormVisible(true);
              setIsEdit(false);
              setCurrentRow(undefined);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
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
