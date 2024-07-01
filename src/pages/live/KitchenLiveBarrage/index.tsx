import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { kitchenLiveBarragePageInfo } from './service';
import type { DeliveryUserTableItem, TableListPagination } from './data';
import MergeForm from './components/MergeForm';
import { kitchenLivePageInfo } from '../KitchenLive/service';
import type { RequestOptionsType } from '@ant-design/pro-utils';

const tableRequest = async (params?: { pageSize: number; current: number }) => {
  const res = await kitchenLiveBarragePageInfo({
    ...params,
    pageNum: params?.current,
  });

  return { data: res.data?.list, success: true, total: res.data?.total };
};

const buildingSelectRequest = async () => {
  const res = await kitchenLivePageInfo({ current: 1, pageNum: 1, pageSize: 100 });
  const zh = (res.data?.list || []).map((v) => {
    return {
      label: v.liveName,
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

  const columns: ProColumns<DeliveryUserTableItem>[] = [
    {
      title: '直播间名称',
      dataIndex: 'liveName',
      hideInSearch: true,
    },
    {
      title: '隶属名称',
      dataIndex: 'areaName',
      hideInSearch: true,
    },
    {
      title: '发送人',
      dataIndex: 'userName',
      hideInSearch: true,
      copyable: true,
    },
    {
      title: '弹幕',
      dataIndex: 'userName',
      hideInSearch: true,
      copyable: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '直播间',
      dataIndex: 'liveId',
      valueType: 'select',
      hideInTable: true,
      request: buildingSelectRequest,
    },
    // {
    //   title: '状态',
    //   dataIndex: 'status',
    //   hideInSearch: true,
    //   valueEnum: {
    //     0: {
    //       text: '禁用',
    //       status: 'Error',
    //     },
    //     1: {
    //       text: '正常',
    //       status: 'Success',
    //     },
    //   },
    // },
    // {
    //   title: '操作',
    //   dataIndex: 'option',
    //   valueType: 'option',
    //   render: (_, record) => [
    //     <a
    //       key="config"
    //       onClick={() => {
    //         setMergeFormVisible(true);
    //         setIsEdit(true);
    //         setCurrentRow(record);
    //       }}
    //     >
    //       编辑
    //     </a>,
    //   ],
    // },
  ];

  return (
    <PageContainer>
      <ProTable<DeliveryUserTableItem, TableListPagination>
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
        isEdit={isEdit}
        onCancel={() => setMergeFormVisible(false)}
        value={currentRow}
        onSuccess={() => {
          actionRef.current?.reload();
        }}
      />
    </PageContainer>
  );
};

export default TableList;
