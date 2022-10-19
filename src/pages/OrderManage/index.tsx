import { message, Popover } from 'antd';
import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { orderPageInfo } from './service';
import type { TableListItem, TableListPagination } from './data';
import { dishTypeValueEnum, orderStatusValueEnum, payStatusValueEnum } from '@/consts/valueEnums';
import { buildingPageInfo } from '../biz/BuildingManage/service';
import type { RequestOptionsType } from '@ant-design/pro-utils';
import { MessageOutlined } from '@ant-design/icons';
import { Access, useAccess } from 'umi';
import OrderDetailModal from './components/OrderDetailModal';
import CancelOrderModal from './components/CancelOrderModal';

const tableRequest = async (params?: { pageSize: number; current: number }) => {
  const res = await orderPageInfo({
    ...params,
    pageNum: params?.current,
  });

  return { data: res.data?.list, success: true, total: res.data?.total };
};

const buildingSelectRequest = async () => {
  const res = await buildingPageInfo({ current: 1, pageNum: 1, pageSize: 100 });
  const zh = (res.data?.list || []).map((v) => {
    return {
      label: v.areaName,
      value: v.id,
    };
  }) as RequestOptionsType[];

  return zh;
};

const TableList: React.FC = () => {
  const [orderDetailVisible, setOrderDetailVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<any>();

  // const [refundFormVisiable, setRefundFormVisiable] = useState<boolean>(false);
  const [cancelOrderModalOpen, setCancelOrderModalOpen] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const access = useAccess();

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '送达时间',
      dataIndex: 'xxx',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            deliveryStartTime: value[0] + ' 00:00:00',
            deliveryEndTime: value[1] + ' 23:59:59',
          };
        },
      },
    },
    {
      title: '楼宇',
      dataIndex: 'areaId',
      hideInTable: true,
      request: buildingSelectRequest,
    },
    {
      title: '订单号',
      dataIndex: 'orderSn',
      // copyable: true,
      width: 200,
      render: (_, record) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(record);
              setOrderDetailVisible(true);
            }}
          >
            {_}
          </a>
        );
      },
    },
    {
      title: '手机号',
      dataIndex: 'abc',
      hideInTable: true,
      search: {
        transform: (v) => {
          return {
            phone: v,
          };
        },
      },
    },
    {
      title: '楼宇',
      dataIndex: 'areaName',
      hideInSearch: true,
    },
    {
      title: '订单金额',
      dataIndex: 'totalPrice',
      valueType: 'money',
      hideInSearch: true,
      tip: '用户实际付款金额',
    },
    {
      title: '创建时间',
      dataIndex: 'ctime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'yyy',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            startTime: value[0] + ' 00:00:00',
            endTime: value[1] + ' 23:59:59',
          };
        },
      },
    },
    {
      title: '订单状态',
      dataIndex: 'orderStatus',
      valueEnum: orderStatusValueEnum,
    },
    {
      title: '支付状态',
      dataIndex: 'payStatus',
      valueEnum: payStatusValueEnum,
    },
    {
      title: '早中晚餐',
      dataIndex: 'dishType',
      hideInTable: true,
      valueEnum: dishTypeValueEnum,
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
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Access
          key="orderDetailBtn"
          accessible={(access.canAdmin || access.canKf) as boolean}
          fallback={null}
        >
          <a
            key="order_cancel"
            onClick={() => {
              const { payStatus } = record;
              if (payStatus !== 'PAY_SUCCESS') {
                message.warn('此订单无法退款.');
                return;
              }

              setCurrentRow(record);
              setCancelOrderModalOpen(true);
            }}
          >
            退单
          </a>
        </Access>,
        <a
          key="order_refund"
          onClick={() => {
            message.success('开发中...');
          }}
        >
          退款
        </a>,
        <TableDropdown
          key="actionGroup"
          onSelect={() => {}}
          menus={[
            { key: 'user_history', name: '历史订单' },
            { key: 'complaint', name: '客户投诉' },
          ]}
        />,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        rowKey="id"
        actionRef={actionRef}
        search={{
          labelWidth: 120,
        }}
        toolBarRender={false}
        request={tableRequest}
        columns={columns}
        rowSelection={false}
      />
      <OrderDetailModal
        visible={orderDetailVisible}
        oid={currentRow?.id}
        onCancel={() => setOrderDetailVisible(false)}
      />
      <CancelOrderModal
        visible={cancelOrderModalOpen}
        value={currentRow}
        onCancel={() => setCancelOrderModalOpen(false)}
        onSuccess={() => {
          setCancelOrderModalOpen(false);
          actionRef.current?.reload();
        }}
      />
    </PageContainer>
  );
};

export default TableList;
