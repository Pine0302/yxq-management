import { message, Popconfirm, Popover } from 'antd';
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
import OrderDetailDrawer from './components/OrderDetailDrawer';
import { Access, useAccess } from 'umi';
import RefundForm from './components/RefundForm';

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

  const [refundFormVisiable, setRefundFormVisiable] = useState<boolean>(false);

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
      copyable: true,
      width: 200,
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
        <a
          key="order_detail"
          onClick={async () => {
            setCurrentRow(record);
            setOrderDetailVisible(true);
          }}
        >
          详情
        </a>,
        <Access
          key="orderDetailBtn"
          accessible={(access.canAdmin || access.canKf) as boolean}
          fallback={null}
        >
          <Popconfirm
            title="确定要取消该订单嘛？"
            onConfirm={() => {
              message.success('开发中...');
              actionRef.current?.reload();
            }}
          >
            <a key="order_cancel">取消</a>
          </Popconfirm>
        </Access>,
        <a
          key="order_refund"
          onClick={() => {
            const { payStatus, orderStatus } = record;
            if (payStatus !== 'PAY_SUCCESS') {
              message.warn('未支付订单无法退款.');
              return;
            }

            console.log('orderStatus', orderStatus);
            // return;
            setCurrentRow(record);
            setRefundFormVisiable(true);
            console.log('log', record);
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

      <OrderDetailDrawer
        visible={orderDetailVisible}
        orderId={currentRow?.id}
        onCancel={() => setOrderDetailVisible(false)}
      />
      <RefundForm
        visible={refundFormVisiable}
        value={currentRow}
        onCancel={() => setRefundFormVisiable(false)}
        onSuccess={() => setRefundFormVisiable(false)}
      />
    </PageContainer>
  );
};

export default TableList;
