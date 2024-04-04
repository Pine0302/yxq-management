import { CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { kitchenUserPageInfo } from './service';
import type { KitchenUserTableItem, TableListPagination } from './data';
import MergeForm from './components/MergeForm';
import { kitchenPageInfo } from '../KitchenManageTs/service';
import type { RequestOptionsType } from '@ant-design/pro-utils';

const tableRequest = async (params?: { pageSize: number; current: number }) => {
  const res = await kitchenUserPageInfo({
    ...params,
    pageNum: params?.current,
  });

  return { data: res.data?.list, success: true, total: res.data?.total };
};

const kitchenSelectRequest = async () => {
  const res = await kitchenPageInfo({ current: 1, pageNum: 1, pageSize: 1000 });
  const zh = (res?.data?.list || []).map((v) => {
    return {
      label: v.name,
      value: v.id,
    };
  }) as RequestOptionsType[];

  return zh;
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
      title: '厨房',
      dataIndex: 'kitchenName',
      hideInSearch: true,
    },
    {
      title: '厨房',
      dataIndex: 'kitchenId',
      valueType: 'select',
      hideInTable: true,
      request: kitchenSelectRequest,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      copyable: true,
    },
    {
      title: '厨房管理员',
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
        <a key="change_pwd" onClick={() => {}}>
          改密
        </a>,
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
