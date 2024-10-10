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
      title: '卡券名称',
      dataIndex: 'name',
    },
    {
      title: '卡券种类',
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
      dataIndex: 'reduce',
      hideInForm: true,
      hideInSearch: true,
      renderText: (_, record) => {
        return `${record.reduce}`;
      },
    },
    {
      title: '有效期',
      dataIndex: '',
      hideInForm: true,
      hideInSearch: true,
      render: (_, record) => {
        const startDate = record.startTime ? new Date(record.startTime) : null;
        const endDate = record.endTime ? new Date(record.endTime) : null;

        if (!startDate || !endDate) {
          return '无效日期';
        }

        const formatDate = (date: Date) => {
          return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(
            date.getDate(),
          ).padStart(2, '0')}`;
        };

        return `${formatDate(startDate)} - ${formatDate(endDate)}`;
      },
    },

    {
      title: '使用规则',
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
      title: '适用楼宇',
      dataIndex: 'activityAreas',
      hideInForm: true,
      hideInSearch: true,
      renderText: (activityAreas: any[]) => {
        if (!activityAreas || activityAreas.length === 0) {
          return '不限制';
        }
        return activityAreas.map((area) => area.areaName).join('，');
      },
    },
    {
      title: '适用商品',
      dataIndex: 'gids',
      hideInForm: true,
      hideInSearch: true,
      render: (text) => (text === '-1' || !text ? '不限制' : text),
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
      title: '领取方式',
      dataIndex: 'sendType',
      hideInForm: true,
      hideInSearch: true,
      renderText: (sendType: string) => {
        switch (sendType) {
          case 'PLATFORM':
            return '平台赠送';
          case 'SCENE':
            return '场景触发';
          case 'PUBLIC':
            return '公开投放';
          default:
            return sendType; // 如果是未知类型,返回原始值
        }
      },
    },
    {
      title: '状态',
      dataIndex: 'sendStatus',
      hideInForm: true,
      hideInSearch: true,
      renderText: (sendStatus: number) => {
        switch (sendStatus) {
          case 0:
            return '未投放';
          case 1:
            return '已投放';
          case 2:
            return '已结束';
          default:
            return sendStatus; // 如果是未知类型,返回原始值
        }
      },
    },
    {
      title: '投放时间',
      dataIndex: 'sendTime',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '投放总数',
      dataIndex: 'totalAmount',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '已领取',
      dataIndex: '',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '已使用',
      dataIndex: '',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '已过期',
      dataIndex: '',
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
    // {
    //   title: '状态',
    //   dataIndex: 'status',
    //   hideInForm: true,
    //   render: (_, record) => {
    //     return <Switch checked={record.status} />;
    //   },
    // },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        switch (record.sendStatus) {
          case 0: // 未投放
            return [
              <a
                key="edit"
                onClick={() => {
                  setMergeFormVisible(true);
                  setIsEdit(true);
                  setCurrentRow(record);
                }}
              >
                编辑
              </a>,
              <a key="launch" onClick={() => handleLaunch(record)}>
                投放
              </a>,
              <a key="delete" onClick={() => handleDelete(record)}>
                删除
              </a>,
            ];
          case 1: // 已投放
            return [
              <a key="details" onClick={() => handleDetails(record)}>
                详情
              </a>,
              <a
                key="modify"
                onClick={() => {
                  setMergeFormVisible(true);
                  setIsEdit(true);
                  setCurrentRow(record);
                }}
              >
                修改
              </a>,
              <a key="end" onClick={() => handleEnd(record)}>
                结束
              </a>,
            ];
          case 2: // 已结束投放
            return [
              <a key="details" onClick={() => handleDetails(record)}>
                详情
              </a>,
            ];
          default:
            return [];
        }
      },
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
