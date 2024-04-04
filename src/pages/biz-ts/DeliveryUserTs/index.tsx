import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { deliveryUserPageInfo } from './service';
import type { DeliveryUserTableItem, TableListPagination } from './data';
import MergeForm from './components/MergeForm';
import { buildingPageInfo } from '../BuildingManageTs/service';
import type { RequestOptionsType } from '@ant-design/pro-utils';

const tableRequest = async (params?: { pageSize: number; current: number }) => {
  const res = await deliveryUserPageInfo({
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
  const actionRef = useRef<ActionType>();
  const [mergeFormVisible, setMergeFormVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<any>();

  const columns: ProColumns<DeliveryUserTableItem>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      hideInSearch: true,
    },
    {
      title: '楼宇',
      dataIndex: 'areaName',
      hideInSearch: true,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      hideInSearch: true,
      copyable: true,
    },
    {
      title: '创建时间',
      dataIndex: 'ctime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '楼宇',
      dataIndex: 'areaId',
      valueType: 'select',
      hideInTable: true,
      request: buildingSelectRequest,
    },
    {
      title: '状态',
      dataIndex: 'status',
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
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            setMergeFormVisible(true);
            setIsEdit(true);
            setCurrentRow(record);
          }}
        >
          编辑
        </a>,
      ],
    },
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
