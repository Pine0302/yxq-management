import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { couponLogPageInfo } from './service';
import type { TableListItem, TableListPagination } from './data';
import { Tag } from 'antd';

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
      title: '卡券名称',
      dataIndex: 'couponName',
    },
    // {
    //   title: 'uid',
    //   dataIndex: 'uid',
    // },
    {
      title: '卡券类型',
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
      title: '序列号',
      dataIndex: 'code',
    },
    {
      title: '面值',
      dataIndex: 'reduce',
    },
    {
      title: '门槛金额',
      dataIndex: 'payFull',
    },
    {
      title: '投放人',
      dataIndex: 'adminAccount',
    },
    {
      title: '发放方式',
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
      title: '投放时间',
      dataIndex: 'sendTime',
    },
    {
      title: '领取人',
      dataIndex: 'mobile',
    },
    {
      title: '领取时间',
      dataIndex: 'ctime',
    },

    // {
    //   title: '免打包费',
    //   dataIndex: 'packageFree',
    //   hideInSearch: true,
    //   render: (_, record) => (record.packageFree ? <CheckOutlined /> : <CloseOutlined />),
    // },
    // {
    //   title: '免配送费',
    //   dataIndex: 'deliveryFree',
    //   hideInSearch: true,
    //   render: (_, record) => (record.deliveryFree ? <CheckOutlined /> : <CloseOutlined />),
    // },
    {
      title: '状态',
      dataIndex: 'sendStatus',
      hideInSearch: true,
      render: (_, record) => {
        if (record.expire === true) {
          return <Tag color="gray">已过期</Tag>;
        } else if (record.status === true) {
          return <Tag color="blue">未使用</Tag>;
        } else {
          return <Tag color="green">已使用</Tag>;
        }
      },
    },
    {
      title: '使用时间',
      dataIndex: 'useTime',
    },

    // {
    //   title: '操作',
    //   dataIndex: 'option',
    //   valueType: 'option',
    //   render: (_, record) => [
    //     <a
    //       key="config"
    //       onClick={() => {
    //         console.log(record);
    //       }}
    //     >
    //       操作
    //     </a>,
    //   ],
    // },
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
