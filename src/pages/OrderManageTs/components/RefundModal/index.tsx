import React, { useEffect, useRef, useState } from 'react';
import type { FormInstance } from 'antd';
import { Space } from 'antd';
import { Tag } from 'antd';
import { message } from 'antd';
import { ModalForm, ProFormGroup, ProFormMoney, ProFormText } from '@ant-design/pro-form';
import { orderDetail, refundOrder } from '../../service';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { payPlatformValueEnum } from '@/consts/valueEnums';

type RefundModalProps = {
  visible?: boolean;
  onCancel?: () => void;
  value?: any;
  onSuccess?: () => void;
};

type DataItem = {
  id: number;
  pid: number;
  name: string;
  image: string;
  sort: number;
  del: string;
};

const cartColumns: ProColumns<any>[] = [
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
    valueType: 'money',
  },
];

const reFund = async (values: any) => {
  console.log('submit', values);

  try {
    const resp = await refundOrder({ ...values });

    console.log('resp', resp);
    message.success('操作成功.');
  } catch (error: any) {
    const { response } = error;
    message.warn(response.msg || '退单失败，请联系管理员.');
  }
};

const RefundModal: React.FC<RefundModalProps> = (props) => {
  const formRef = useRef<FormInstance<any>>();
  const { visible, value: val, onCancel, onSuccess } = props;

  const [userInfoDs, setUserInfoDs] = useState<any>();
  const [payInfoDs, setPayInfoDs] = useState<any>();
  const [cartDs, setCartDs] = useState<any>();

  const fetchOrderDetail = async (id: number) => {
    const res = await orderDetail({ id: id });

    const {
      orderAddressDTO,
      payment,
      cartDTOS,
      packageFee,
      deliveryFee,
      serialNumber,
      deliveryTime,
    } = res.data || {};
    setUserInfoDs({ ...orderAddressDTO });
    setPayInfoDs({ ...payment, packageFee, deliveryFee, serialNumber, deliveryTime });
    setCartDs(cartDTOS);

    console.log('orderDetail', res);
    console.log('params', val);
  };

  useEffect(() => {
    formRef.current?.resetFields();
    formRef.current?.setFieldsValue({ oid: val?.id });
  }, [val]);

  return (
    <ModalForm<DataItem>
      title="订单退款"
      formRef={formRef}
      width={1100}
      layout="vertical"
      // labelCol={{ span: 8 }}
      wrapperCol={{ span: 24 }}
      onFinish={async (values) => {
        await reFund(values);
        onSuccess?.();
        return true;
      }}
      visible={visible}
      onVisibleChange={async (v) => {
        if (v) {
          await fetchOrderDetail(val?.id);
        } else {
          onCancel?.();
        }
      }}
    >
      <ProDescriptions<any> column={4} dataSource={userInfoDs} title="用户信息">
        <ProDescriptions.Item
          dataIndex="contacts"
          label="姓名"
          render={(_, record) => {
            return (
              <>
                <Space>
                  <span>{record.contacts}</span>
                  <Tag color="processing">{record.gender}</Tag>
                </Space>
              </>
            );
          }}
        />
        <ProDescriptions.Item dataIndex="phone" label="手机" />
        <ProDescriptions.Item
          dataIndex="phone"
          label="收货地址"
          render={(_, record) => {
            return (
              <>
                <Space>
                  <span>
                    {record.address} {record.building} {record.houseNumber}
                  </span>
                  <Tag color="processing">{record.label}</Tag>
                </Space>
              </>
            );
          }}
        />
      </ProDescriptions>
      <ProDescriptions<any> column={4} dataSource={payInfoDs} title="支付信息">
        <ProDescriptions.Item dataIndex="createTime" label="支付时间" valueType="dateTime" />
        <ProDescriptions.Item dataIndex="outTradeNo" label="商户订单号" />
        <ProDescriptions.Item
          dataIndex="payType"
          label="支付方式"
          valueEnum={payPlatformValueEnum}
        />
        <ProDescriptions.Item dataIndex="packageFee" label="打包费" valueType="money" />
        <ProDescriptions.Item dataIndex="deliveryFee" label="配送费" valueType="money" />
        <ProDescriptions.Item
          dataIndex="fee"
          label="实付金额"
          renderText={(_, record) => {
            const fenFee = record.fee as number;
            return '￥' + (fenFee / 100).toFixed(2);
          }}
        />
        <ProDescriptions.Item dataIndex="serialNumber" label="订单流水号" />
        <ProDescriptions.Item dataIndex="deliveryTime" label="预计送达时间" valueType="dateTime" />
      </ProDescriptions>
      <ProTable
        style={{ marginBottom: 24 }}
        pagination={false}
        search={false}
        // loading={detailLoading}
        options={false}
        toolBarRender={false}
        dataSource={cartDs}
        columns={cartColumns}
        rowKey="gid"
      />

      <ProFormText name="oid" hidden />
      <ProFormGroup
        title={
          <>
            <span style={{ fontWeight: 700, fontSize: 16 }}>退款信息&nbsp;</span>
          </>
        }
      >
        <ProFormMoney
          width="lg"
          name="refundPrice"
          label="退款金额"
          placeholder="请输入退款金额"
          rules={[{ required: true }]}
        />
        <ProFormText
          width="lg"
          name="reason"
          label="退款原因"
          placeholder="请输入退款原因"
          rules={[{ required: true }]}
        />
      </ProFormGroup>
    </ModalForm>
  );
};

export default RefundModal;
