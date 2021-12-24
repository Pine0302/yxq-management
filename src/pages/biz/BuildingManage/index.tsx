import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { buildingPageInfo } from './service';
import type { BuildingTableItem, TableListPagination } from './data';
import MergeForm from './components/MergeForm';

const tableRequest = async (params?: { pageSize: number; current: number }) => {
  const res = await buildingPageInfo({
    ...params,
    pageNum: params?.current,
  });

  return { data: res.data?.list, success: true, total: res.data?.total };
};

const TableList: React.FC = () => {
  const [mergeFormVisible, setMergeFormVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */

  const actionRef = useRef<ActionType>();
  // const [currentRow, setCurrentRow] = useState<TableListItem>();
  /** 国际化配置 */

  const columns: ProColumns<BuildingTableItem>[] = [
    {
      title: '楼宇名称',
      dataIndex: 'areaName',
    },
    {
      title: '省份',
      dataIndex: 'province',
    },
    {
      title: '城市',
      dataIndex: 'city',
    },
    {
      title: '经纬度',
      dataIndex: 'aaa',
      renderText: (_, record) => {
        return `经度：${record.longitude}，维度：${record.latitude}`;
      },
    },
    {
      title: '配送方式',
      dataIndex: 'pickUpType',
      valueEnum: {
        FIXED_POS: {
          text: '用户自提',
          status: 'processing',
        },
        TO_ADDR: {
          text: '送货上门',
          status: 'success',
        },
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        CLOSED: {
          text: '关闭',
          status: 'Error',
        },
        OK: {
          text: '正常',
          status: 'Success',
        },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'ctime',
      valueType: 'dateTime',
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
            // setCurrentRow(record);
            console.log(record);
          }}
        >
          编辑
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<BuildingTableItem, TableListPagination>
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
        onCancel={() => setMergeFormVisible(false)}
        isEdit={isEdit}
      />
    </PageContainer>
  );
};

export default TableList;
