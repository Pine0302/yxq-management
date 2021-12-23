import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { kitchenPageInfo } from './service';
import type { KitchenTableItem, TableListPagination } from './data';
import MergeForm from './components/MergeForm';

const tableRequest = async (params?: { pageSize: number; current: number }) => {
  const res = await kitchenPageInfo({
    ...params,
    pageNum: params?.current,
  });

  return { data: res.data?.list, success: true, total: res.data?.total };
};

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [mergeModalVisible, setMergeModalVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<KitchenTableItem>();

  const columns: ProColumns<KitchenTableItem>[] = [
    {
      title: '厨房名称',
      dataIndex: 'name',
      hideInSearch: true,
    },
    {
      title: '联系人',
      dataIndex: 'contact',
      hideInSearch: true,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInSearch: true,
      valueEnum: {
        OK: {
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
          key="edit"
          onClick={() => {
            setMergeModalVisible(true);
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
      <ProTable<KitchenTableItem, TableListPagination>
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
              setMergeModalVisible(true);
              setIsEdit(false);
              setCurrentRow(undefined);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={tableRequest}
        columns={columns}
      />

      <MergeForm
        modalVisible={mergeModalVisible}
        onCancel={() => {
          setMergeModalVisible(false);
        }}
        onSuccess={() => {
          actionRef.current?.reload();
        }}
        isEdit={isEdit}
        value={currentRow}
      />
    </PageContainer>
  );
};

export default TableList;
