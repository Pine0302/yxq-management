import { PlusOutlined } from '@ant-design/icons';
import { Button, Drawer } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { buildingPageInfo } from './service';
import type { BuildingTableItem, TableListPagination } from './data';
import MergeForm from './components/MergeForm';
import QrCodeModal from './components/QrCodeModal';
import DayDinnerForm from './components/DayDinnerForm';
import WeekDinnerForm from './components/WeekDinnerForm';
import AreaActForm from './components/AreaActForm';
import AddressTemplateForm from './components/AddresstemplateForm';

const TableList: React.FC = () => {
  const [mergeFormVisible, setMergeFormVisible] = useState<boolean>(false);
  const [dayDinnerFormVisible, setDayDinnerFormVisible] = useState<boolean>(false);
  const [weekDinnerFormVisible, setWeekDinnerFormVisible] = useState<boolean>(false);
  const [areaActFormVisible, setAreaActFormVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<any>();
  const [tableData, setTableData] = useState<BuildingTableItem[]>([]);

  const [qrCodeModalOpen, setQrCodeModalOpen] = useState<boolean>(false);

  const [addressTemplateFormVisible, setAddressTemplateFormVisible] = useState(false); // 控制地址模板列表的显示
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false); // 控制Drawer的显示
  const [key, setKey] = useState(0);
  const [openDayDinnerForm, setOpenDayDinnerForm] = useState(false);

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
            setOpenDayDinnerForm(true); // 设置打开餐次详情的请求
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
        <a
          key="areaact"
          onClick={() => {
            setAreaActFormVisible(true);
            setIsEdit(true);
            setCurrentRow(record);
            console.log(record);
          }}
        >
          楼宇活动
        </a>,
        <a
          key="addressTemplate"
          onClick={() => {
            setCurrentRow(record);
            setDrawerVisible(true); // 打开Drawer
          }}
        >
          地址模板管理
        </a>,
      ],
    },
  ];

  const tableRequest = async (params?: { pageSize: number; current: number }) => {
    const res = await buildingPageInfo({
      ...params,
      pageNum: params?.current,
    });

    return { data: res.data?.list, success: true, total: res.data?.total };
  };

  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
  }, [tableData]); // 当 tableData 更新时，更改 key 强制刷新 ProTable

  useEffect(() => {
    const fetchData = async () => {
      const response = await tableRequest();
      if (response.success) {
        setTableData(response.data);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (openDayDinnerForm && currentRow) {
      setDayDinnerFormVisible(true);
      setOpenDayDinnerForm(false); // 重置打开标记
    }
  }, [openDayDinnerForm, currentRow]); // 监听 openDayDinnerForm 和 currentRow

  const updateBuildingTimes = (id, startTime, endTime) => {
    console.log('updateBuildingTimes-id:', id);
    console.log('updateBuildingTimes-starttime:', startTime);
    console.log('updateBuildingTimes-endtime:', endTime);
    const updatedData = tableData.map((item) => {
      console.log('Current item in loop:', item);
      if (item.id === id) {
        console.log('Updating item:', item);
        return { ...item, startTime, endTime };
      }
      return item;
    });
    console.log('Updated data:', updatedData);
    setTableData(updatedData);
    // 更新当前选中的行以反映最新数据
    const newCurrentRow = updatedData.find((item) => item.id === id);
    if (newCurrentRow) {
      setCurrentRow(newCurrentRow);
    }
  };
  return (
    <PageContainer>
      <ProTable<BuildingTableItem, TableListPagination>
        key={key}
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
        key={currentRow ? currentRow.id : 'new'}
        visible={dayDinnerFormVisible}
        onCancel={() => setDayDinnerFormVisible(false)}
        onSuccess={() => {
          // 在餐次信息成功更新后触发列表的重新加载
          if (actionRef.current) {
            actionRef.current.reload();
          }
        }}
        isEdit={isEdit}
        value={currentRow}
        onSave={(startTime, endTime) => {
          console.log('Reloading data...');
          updateBuildingTimes(currentRow.id, startTime, endTime);
          //  forceUpdate(); // 调用更新函数来强制重新渲染列表
        }}
      />
      <WeekDinnerForm
        visible={weekDinnerFormVisible}
        onCancel={() => setWeekDinnerFormVisible(false)}
        onSuccess={() => actionRef.current?.reload()}
        isEdit={isEdit}
        value={currentRow}
      />
      <AreaActForm
        visible={areaActFormVisible}
        onCancel={() => setAreaActFormVisible(false)}
        onSuccess={() => actionRef.current?.reload()}
        isEdit={isEdit}
        value={currentRow}
      />

      {drawerVisible && (
        <Drawer
          title="地址模板管理"
          width={720}
          onClose={() => setDrawerVisible(false)}
          visible={drawerVisible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <AddressTemplateForm
            visible={drawerVisible}
            onCancel={() => setDrawerVisible(false)}
            areaId={currentRow?.id}
          />
        </Drawer>
      )}

      {/* <a
        key="addressTemplate"
        onClick={() => {
          setCurrentRow(currentRow);
          setDrawerVisible(true);
          setKey((prev) => prev + 1); // 改变 key 强制刷新
        }}
      >
        .
      </a> */}
    </PageContainer>
  );
};

export default TableList;
