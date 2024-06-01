import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { buildingPageInfo } from './service';
import type { BuildingTableItem, TableListPagination } from './data';
import MergeForm from './components/MergeForm';
import QrCodeModal from './components/QrCodeModal';
import DayDinnerForm from './components/DayDinnerForm';
import WeekDinnerForm from './components/WeekDinnerForm';

const tableRequest = async (params?: { pageSize: number; current: number }) => {
  const res = await buildingPageInfo({
    ...params,
    pageNum: params?.current,
  });

  return { data: res.data?.list, success: true, total: res.data?.total };
};

const TableList: React.FC = () => {
  const [mergeFormVisible, setMergeFormVisible] = useState<boolean>(false);
  const [dayDinnerFormVisible, setDayDinnerFormVisible] = useState<boolean>(false);
  const [weekDinnerFormVisible, setWeekDinnerFormVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<any>();

  const [qrCodeModalOpen, setQrCodeModalOpen] = useState<boolean>(false);

  const columns: ProColumns<BuildingTableItem>[] = [
    {
      title: '楼宇名称',
      dataIndex: 'areaName',
    },
    {
      title: '厨房',
      dataIndex: 'kitchenName',
      hideInSearch: true,
    },
    {
      title: '省份',
      dataIndex: 'province',
      hideInSearch: true,
    },
    {
      title: '城市',
      dataIndex: 'city',
      hideInSearch: true,
    },
    {
      title: '经纬度',
      dataIndex: 'aaa',
      hideInSearch: true,
      renderText: (_, record) => {
        return `经度：${record.longitude}，维度：${record.latitude}`;
      },
    },
    {
      title: '配送方式',
      dataIndex: 'pickUpType',
      hideInSearch: true,
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
      hideInSearch: true,
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
      hideInSearch: true,
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
            console.log(record);
          }}
        >
          编辑
        </a>,
        <a
          key="qrcode"
          onClick={() => {
            setQrCodeModalOpen(true);
            setCurrentRow(record);
          }}
        >
          取餐码
        </a>,
        <a
          key="daydinner"
          onClick={() => {
            setDayDinnerFormVisible(true);
            setIsEdit(true);
            setCurrentRow(record);
            console.log(record);
          }}
        >
          餐次
        </a>,
        <a
          key="weekdinner"
          onClick={() => {
            setWeekDinnerFormVisible(true);
            setIsEdit(true);
            setCurrentRow(record);
            console.log(record);
          }}
        >
          周营业
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<BuildingTableItem, TableListPagination>
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
        onCancel={() => setMergeFormVisible(false)}
        onSuccess={() => actionRef.current?.reload()}
        isEdit={isEdit}
        value={currentRow}
      />
      <QrCodeModal
        value={currentRow}
        open={qrCodeModalOpen}
        onOk={() => setQrCodeModalOpen(false)}
        onCancel={() => setQrCodeModalOpen(false)}
      />
      <DayDinnerForm
        visible={dayDinnerFormVisible}
        onCancel={() => setDayDinnerFormVisible(false)}
        onSuccess={() => actionRef.current?.reload()}
        isEdit={isEdit}
        value={currentRow}
      />
      <WeekDinnerForm
        visible={weekDinnerFormVisible}
        onCancel={() => setWeekDinnerFormVisible(false)}
        onSuccess={() => actionRef.current?.reload()}
        isEdit={isEdit}
        value={currentRow}
      />
    </PageContainer>
  );
};

export default TableList;
