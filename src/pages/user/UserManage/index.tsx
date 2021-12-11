import { Image } from 'antd';
import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { userPageInfo } from './service';
import type { TableListPagination, UserTableItem } from './data';
import { nullImage } from '@/consts/consts';

const tableRequest = async (params?: { pageSize: number; current: number }) => {
  const res = await userPageInfo({
    ...params,
    pageNum: params?.current,
  });

  return { data: res.data?.list, success: true, total: res.data?.total };
};

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<UserTableItem>[] = [
    {
      title: '头像',
      dataIndex: 'avatar',
      hideInSearch: true,
      width: 60,
      render: (_, record) => <Image width={55} src={record.avatar} fallback={nullImage} />,
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      hideInSearch: true,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInSearch: true,
      valueEnum: {
        0: {
          text: '关闭',
          status: 'Error',
        },
        1: {
          text: '正常',
          status: 'Success',
        },
      },
    },
    {
      title: '注册时间',
      dataIndex: 'ctime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '推广id',
      dataIndex: 'promoId',
      hideInTable: true,
    },
    {
      title: '注册时间',
      dataIndex: 'ctime',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (v) => {
          return {
            startTime: v[0] + ' 00:00:00',
            endTime: v[1] + ' 23:59:59',
          };
        },
      },
    },

    // {
    //   title: '操作',
    //   dataIndex: 'option',
    //   valueType: 'option',
    //   render: (_, record) => [
    //     <a
    //       key="config"
    //       onClick={() => {
    //         handleUpdateModalVisible(true);
    //         setCurrentRow(record);
    //       }}
    //     >
    //       配置
    //     </a>,
    //   ],
    // },
  ];

  return (
    <PageContainer>
      <ProTable<UserTableItem, TableListPagination>
        // headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={false}
        request={tableRequest}
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableList;
