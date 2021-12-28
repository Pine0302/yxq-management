import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { couponLogPageInfo } from './service';
import type { TableListItem, TableListPagination } from './data';

const tableRequest = async (params?: { pageSize: number; current: number }) => {
  const res = await couponLogPageInfo({
    ...params,
    pageNum: params?.current,
  });

  return { data: res.data?.list, success: true, total: res.data?.total };
};

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '名称',
      dataIndex: 'couponName',
    },
    {
      title: 'uid',
      dataIndex: 'uid',
    },
    {
      title: '类型',
      dataIndex: 'type',
      hideInSearch: true,
      valueEnum: {
        DISCOUNT: {
          text: '折扣券',
          status: 'Success',
        },
        FULL_REDUCE: {
          text: '满减券',
          status: 'Waraning',
        },
      },
    },
    {
      title: '免打包费',
      dataIndex: 'packageFree',
      hideInSearch: true,
      render: (_, record) => (record.packageFree ? <CheckOutlined /> : <CloseOutlined />),
    },
    {
      title: '免配送费',
      dataIndex: 'deliveryFree',
      hideInSearch: true,
      render: (_, record) => (record.deliveryFree ? <CheckOutlined /> : <CloseOutlined />),
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInSearch: true,
      render: (_, record) => (record.status ? <CheckOutlined /> : <CloseOutlined />),
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            console.log(record);
          }}
        >
          操作
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={false}
        request={tableRequest}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            console.log(selectedRows);
            // setSelectedRows(selectedRows);
          },
        }}
      />
    </PageContainer>
  );
};

export default TableList;
