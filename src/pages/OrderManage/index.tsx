import { Drawer } from 'antd';
import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import { orderPageInfo, orderDetail } from './service';
import type { TableListItem, TableListPagination, OrderDetailDTO, cartItemDTO } from './data';
import styles from './style.less';
import {
  orderStatusValueEnum,
  payPlatformValueEnum,
  payStatusValueEnum,
} from '@/consts/valueEnums';
import { buildingPageInfo } from '../biz/BuildingManage/service';
import type { RequestOptionsType } from '@ant-design/pro-utils';

const tableRequest = async (params?: { pageSize: number; current: number }) => {
  const res = await orderPageInfo({
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
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [userInfoDs, setUserInfoDs] = useState<any>();
  const [payInfoDs, setPayInfoDs] = useState<any>();
  const [cartDs, setCartDs] = useState<any>();
  const [detailLoading, setDetailLoading] = useState<boolean>(true);

  const detailRequest = async (id: number) => {
    setDetailLoading(true);
    const res = await orderDetail({ id: id });

    const { orderAddressDTO, payment, cartDTOS, packageFee, deliveryFee } =
      res.data as OrderDetailDTO;
    setUserInfoDs({ ...orderAddressDTO });
    setPayInfoDs({ ...payment, packageFee, deliveryFee });
    setCartDs(cartDTOS);

    setDetailLoading(false);
  };

  /** 国际化配置 */

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '送达时间',
      dataIndex: 'xxx',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            deliveryStartTime: value[0] + ' 00:00:00',
            deliveryEndTime: value[1] + ' 23:59:59',
          };
        },
      },
    },
    {
      title: '楼宇',
      dataIndex: 'areaId',
      hideInTable: true,
      request: buildingSelectRequest,
    },
    {
      title: '订单号',
      dataIndex: 'orderSn',
      copyable: true,
      width: 200,
    },
    {
      title: '手机号',
      dataIndex: 'abc',
      hideInTable: true,
      search: {
        transform: (v) => {
          return {
            phone: v,
          };
        },
      },
    },
    {
      title: '楼宇',
      dataIndex: 'areaName',
      hideInSearch: true,
    },
    {
      title: '订单金额',
      dataIndex: 'totalPrice',
      valueType: 'money',
      hideInSearch: true,
      tip: '用户实际付款金额',
    },
    {
      title: '创建时间',
      dataIndex: 'ctime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'yyy',
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
      title: '订单状态',
      dataIndex: 'orderStatus',
      valueEnum: orderStatusValueEnum,
    },
    {
      title: '支付状态',
      dataIndex: 'payStatus',
      valueEnum: payStatusValueEnum,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={async () => {
            // setCurrentRow(record);
            setShowDetail(true);
            // console.log(record);
            await detailRequest(record?.id as number);
          }}
        >
          查看详情
        </a>,
        <a key="subscribeAlert" onClick={() => {}}>
          干其他的
        </a>,
        <TableDropdown
          key="actionGroup"
          onSelect={() => {}}
          menus={[
            { key: 'copy', name: '订单详情' },
            { key: 'delete', name: '历史订单' },
            { key: 'ts', name: '客户投诉' },
          ]}
        />,
      ],
    },
  ];

  const cartColumns: ProColumns<cartItemDTO>[] = [
    {
      title: '商品名称',
      dataIndex: 'gname',
    },
    {
      title: '数量',
      dataIndex: 'amount',
    },
    {
      title: '原价',
      dataIndex: 'price',
      valueType: 'money',
    },
    {
      title: '到手价',
      dataIndex: 'realPrice',
      valueType: 'money',
    },
    {
      title: '打包费',
      dataIndex: 'packageFee',
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={false}
        request={tableRequest}
        columns={columns}
        rowSelection={false}
      />

      <Drawer
        width={800}
        visible={showDetail}
        title={'订单详情'}
        onClose={() => {
          setShowDetail(false);
        }}
        closable={true}
      >
        <ProDescriptions<any>
          column={3}
          title={'用户信息'}
          dataSource={userInfoDs}
          loading={detailLoading}
        >
          <ProDescriptions.Item
            dataIndex="contacts"
            label="姓名"
            renderText={(_, record) => `${record.contacts}(${record.gender})`}
          />
          <ProDescriptions.Item dataIndex="phone" label="手机号" />
          <ProDescriptions.Item
            dataIndex="contacts"
            label="联系地址"
            renderText={(_, record) =>
              `[${record.label}] ${record.address} ${record.building} ${record.houseNumber}`
            }
          />
        </ProDescriptions>
        <ProDescriptions<any>
          column={3}
          title={'支付信息'}
          dataSource={payInfoDs}
          loading={detailLoading}
        >
          <ProDescriptions.Item dataIndex="createTime" label="支付时间" valueType={'dateTime'} />
          <ProDescriptions.Item dataIndex="outTradeNo" label="商户订单号" />
          <ProDescriptions.Item
            dataIndex="payType"
            label="支付方式"
            valueEnum={payPlatformValueEnum}
          />
          <ProDescriptions.Item dataIndex="packageFee" label="打包费" valueType={'money'} />
          <ProDescriptions.Item dataIndex="deliveryFee" label="配送费" valueType={'money'} />
          <ProDescriptions.Item
            dataIndex="fee"
            label="支付金额"
            renderText={(_, record) => {
              const fenFee = record.fee as number;
              return '￥' + (fenFee / 100).toFixed(2);
            }}
          />
        </ProDescriptions>
        <div className={styles.title}>商品明细</div>
        <ProTable
          style={{ marginBottom: 24 }}
          pagination={false}
          search={false}
          loading={detailLoading}
          options={false}
          toolBarRender={false}
          dataSource={cartDs}
          columns={cartColumns}
          rowKey="gid"
        />
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
