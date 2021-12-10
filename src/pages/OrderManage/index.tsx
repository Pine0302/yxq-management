// import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
// import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import { updateRule, orderPageInfo, orderDetail } from './service';
import type { TableListItem, TableListPagination, OrderDetailWrapper, OrderDetailDTO } from './data';



// const handleUpdate = async (fields: FormValueType, currentRow?: TableListItem) => {
//   const hide = message.loading('正在配置');

//   try {
//     await updateRule({
//       ...currentRow,
//       ...fields,
//     });
//     hide();
//     message.success('配置成功');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('配置失败请重试！');
//     return false;
//   }
// };

const tableRequest = async (params?: {pageSize: number ,current: number}) => {
  
  const res = await orderPageInfo({
    ...params,
    pageNum: params?.current,
  });

  return {data: res.data?.list, success: true, total: res.data?.total}
};

const TableList: React.FC = () => {

  /** 分布更新窗口的弹窗 */

  // const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const userInfoActionRef = useRef<ActionType>();

  const [userInfoDs, setUserInfoDs] = useState<any>();
  let cartDs = {};
  let payInfoDs = {};

  const detailRequest = async (id: number) => {
    // const orderId: number = currentRow?.id as number;
    // console.log(id);
    const res = await orderDetail({id: id});
  
    const { orderAddressDTO } = res.data as OrderDetailDTO;
    setUserInfoDs({...orderAddressDTO});
    // console.log(userInfoDs);

    // return Promise.resolve({
    //   success: true,
    //   data: res?.data
    // })
  }

  /** 国际化配置 */

  const orderStatusEnum = {
    CANCELED: {
      text: '已取消',
      status: 'Warning'
    },
    WAIT_PAY: {
      text: '待支付',
      status: 'Error'
    },
    MAKING: {
      text: '制作中',
      status: 'Processing'
    },
    ON_THE_WAY: {
      text: '配送中',
      status: 'Default'
    },
    ARRIVED: {
      text: '已送达',
      status: 'Success'
    },
    COMMENTED: {
      text: '已评价',
      status: 'purple'
    },
  };

  const payStatusEnum = {
    WAIT_PAY: {
      text: '待支付',
      status: 'Warning'
    },
    PAY_SUCCESS: {
      text: '支付成功',
      status: 'Success'
    },
    PAY_FAIL: {
      text: '支付失败',
      status: 'Error'
    },
    RETURN_MONEY: {
      text: '退款中',
      status: 'Processing'
    },
    RETURN_MONEY_SUCCESS: {
      text: '退款成功',
      status: 'lime'
    },
  };

  const columns: ProColumns<TableListItem>[] = [
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
            phone: v
          }
        }
      }
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
      // renderText: (val: string) => `￥${val}`,
    },
    {
      title: '创建时间',
      dataIndex: 'ctime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '送达时间',
      dataIndex: 'ctime',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            deliveryStartTime: value[0] + ' 00:00:00',
            deliveryEndTime: value[1] + ' 23:59:59',
          };
        },
      }
    },
    {
      title: '创建时间',
      dataIndex: 'ctime',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            startTime: value[0] + ' 00:00:00',
            endTime: value[1] + ' 23:59:59',
          };
        },
      }
    },
    {
      title: '订单状态',
      dataIndex: 'orderStatus',
      valueEnum: orderStatusEnum,
    },
    {
      title: '支付状态',
      dataIndex: 'payStatus',
      valueEnum: payStatusEnum,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={async () => {
            setCurrentRow(record);
            setShowDetail(true);
            // console.log(record);
            await detailRequest(record?.id as number);
            // userInfoActionRef.current?.reload();
          }}
        >
          查看详情
        </a>,
        <a 
          key="subscribeAlert"
          onClick={()=>{}}
        >
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

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        // headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={false}
        // toolBarRender={() => [
        //   <Button
        //     type="primary"
        //     key="primary"
        //     onClick={() => {
        //       handleModalVisible(true);
        //     }}
        //   >
        //     <PlusOutlined /> 新建
        //   </Button>,
        // ]}
        request={ tableRequest }
        // dataSource={data.list}
        columns={columns}
        rowSelection={false}
      />

      <Drawer
        width={800}
        visible={showDetail}
        title={'订单详情'}
        onClose={() => {
          // setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={true}
      >
        <ProDescriptions<any>
          actionRef={userInfoActionRef}
          column={3}
          title={'用户信息'}
          dataSource={userInfoDs}
        >
          <ProDescriptions.Item dataIndex="contacts" label="姓名" renderText={(_, record) => `${record.contacts}(${record.gender})`} />
          <ProDescriptions.Item dataIndex="phone" label="手机号" />
          <ProDescriptions.Item 
            dataIndex="contacts" 
            label="联系地址" 
            renderText={(_, record) => `[${record.label}] ${record.address} ${record.building} ${record.houseNumber}`} 
          />
        </ProDescriptions>
        
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
