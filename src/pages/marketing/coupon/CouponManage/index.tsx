import { CheckOutlined, CloseOutlined, MessageOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Popover, Switch } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { couponPageInfo } from './service';
import type { TableListItem, TableListPagination } from './data';
import MergeForm from './components/MergeForm';

const tableRequest = async (params?: { pageSize: number; current: number }) => {
  const res = await couponPageInfo({
    ...params,
    pageNum: params?.current,
  });

  return { data: res.data?.list, success: true, total: res.data?.total };
};

const CouponManage: React.FC = () => {
  const [mergeFormVisible, setMergeFormVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<any>();

  const actionRef = useRef<ActionType>();

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '优惠券名称',
      dataIndex: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
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
      title: '面值',
      dataIndex: 'xx',
      hideInForm: true,
      hideInSearch: true,
      renderText: (_, record) => {
        return `${record.discount}`;
      },
    },
    {
      title: '适用楼宇',
      dataIndex: 'callNo',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '适用商品',
      dataIndex: 'callNo',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '免包装费',
      dataIndex: 'packageFree',
      hideInForm: true,
      hideInSearch: true,
      render: (_, record) => (record.packageFree ? <CheckOutlined /> : <CloseOutlined />),
    },
    {
      title: '免配送费',
      dataIndex: 'deliveryFree',
      hideInForm: true,
      hideInSearch: true,
      render: (_, record) => (record.deliveryFree ? <CheckOutlined /> : <CloseOutlined />),
    },
    {
      title: '限额',
      tooltip: '每用户限额',
      dataIndex: 'limitPerUser',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      hideInForm: true,
      hideInSearch: true,
      render: (_, record) => {
        const rd = record.remark && (
          <Popover content={record.remark}>
            <MessageOutlined />
          </Popover>
        );
        return rd;
      },
    },
    {
      title: '总数',
      dataIndex: 'totalAmount',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '失效时间',
      dataIndex: 'endTime',
      hideInForm: true,
      hideInSearch: true,
      valueType: 'dateTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      render: (_, record) => {
        return <Switch checked={record.status} />;
      },
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
          }}
        >
          修改
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
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setMergeFormVisible(true);
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
        isEdit={isEdit}
        value={currentRow}
        onCancel={() => setMergeFormVisible(false)}
        onSuccess={() => actionRef.current?.reload()}
      />
    </PageContainer>
  );
};

export default CouponManage;
