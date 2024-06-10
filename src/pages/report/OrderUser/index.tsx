import { message, Popover, Button, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { orderUserPageInfo, orderPrint } from './service';
import type { TableListItem, TableListPagination } from './data';
import { dishTypeValueEnum, orderStatusValueEnum, payStatusValueEnum } from '@/consts/valueEnums';
import { buildingPageInfoNoSource } from '../../biz/BuildingManage/service';
import type { RequestOptionsType } from '@ant-design/pro-utils';
import { MessageOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Access, useAccess } from 'umi';
import OrderDetailModal from './components/OrderDetailModal';
import CancelOrderModal from './components/CancelOrderModal';
import moment from 'moment'; // 引入moment用于日期处理
const tableRequest = async (params?: { pageSize: number; current: number }) => {
  const res = await orderUserPageInfo({
    ...params,
    pageNum: params?.current,
  });

  return { data: res.data?.list, success: true, total: res.data?.total };
};

const buildingSelectRequest = async () => {
  const res = await buildingPageInfoNoSource({ current: 1, pageNum: 1, pageSize: 100 });
  const zh = (res.data?.list || []).map((v) => {
    return {
      label: v.areaName,
      value: v.id,
    };
  }) as RequestOptionsType[];

  return zh;
};

//const printOrders = async (v: any) => {
//  await orderPrint(v);
//};
const printOrders = (params) => {
  // 使用URLSearchParams来处理查询参数，使其能够通过URL传递
  const query = new URLSearchParams(params).toString();
  console.log(query);
  // 直接改变浏览器的当前位置到下载接口，带上参数
  window.location.href = `/adminapi/report/downloadOrderUserExcel?${query}`;
};

const TableList: React.FC = () => {
  const [orderDetailVisible, setOrderDetailVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<any>();

  // const [refundFormVisiable, setRefundFormVisiable] = useState<boolean>(false);
  const [cancelOrderModalOpen, setCancelOrderModalOpen] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const access = useAccess();

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '楼宇',
      dataIndex: 'areaId',
      hideInTable: true,
      request: buildingSelectRequest,
    },
    {
      title: '统计时间',
      dataIndex: 'xxx',
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
      title: '用户姓名',
      dataIndex: 'userName',
      hideInSearch: true,
    },
    {
      title: '手机号',
      dataIndex: 'userPhone',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '楼宇',
      dataIndex: 'areaName',
      hideInSearch: true,
    },
    {
      title: '下单次数',
      dataIndex: 'totalOrders',
      hideInSearch: true,
    },
    {
      title: '首次下单时间',
      dataIndex: 'firstOrderTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '最后一次下单时间',
      dataIndex: 'lastOrderTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        rowKey="id"
        actionRef={actionRef}
        manualRequest={true}
        search={{
          labelWidth: 120,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
            <Popconfirm
              key="ppk"
              title="确定要导出吗？"
              okText="确定"
              cancelText="取消"
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              onConfirm={async () => {
                // xxx  送达时间 yyy 下单时间
                const values = searchConfig?.form?.getFieldsValue();
                const params = {
                  areaId: values.areaId,
                };
                if (values.xxx) {
                  params['startTime'] = values.xxx[0].format('YYYY-MM-DD 00:00:00');
                  params['endTime'] = values.xxx[1].format('YYYY-MM-DD 23:59:59');
                  // delete values.xxx;
                }
                console.log(params);
                await printOrders(params);
                // message.info('打印任务已提交，你等待打印机打印.');
              }}
            >
              <Button key="printBtn">导出所有数据</Button>
            </Popconfirm>,
          ],
        }}
        toolBarRender={false}
        request={tableRequest}
        columns={columns}
        rowSelection={false}
        beforeSearchSubmit={(params) => {
          // 检查必须字段是否已填
          if (!params.areaId || !params.startTime || !params.endTime) {
            message.error('请先选择楼宇和统计时间。');
            return false;
          }

          // 将字符串日期转换为moment对象
          const startTime = moment(params.startTime);
          const endTime = moment(params.endTime);

          // 检查时间逻辑
          if (endTime.isBefore(startTime)) {
            message.error('结束时间必须大于开始时间。');
            return false;
          }
          if (endTime.diff(startTime, 'months', true) > 2) {
            message.error('结束时间不得超过开始时间两个月。');
            return false;
          }

          // 可以继续将转换后的日期发送到请求参数中
          params.startTime = startTime.format('YYYY-MM-DD HH:mm:ss');
          params.endTime = endTime.format('YYYY-MM-DD HH:mm:ss');

          return params;
        }}
      />
      <OrderDetailModal
        visible={orderDetailVisible}
        oid={currentRow?.id}
        onCancel={() => setOrderDetailVisible(false)}
      />
      <CancelOrderModal
        visible={cancelOrderModalOpen}
        value={currentRow}
        onCancel={() => setCancelOrderModalOpen(false)}
        onSuccess={() => {
          setCancelOrderModalOpen(false);
          actionRef.current?.reload();
        }}
      />
    </PageContainer>
  );
};

export default TableList;
