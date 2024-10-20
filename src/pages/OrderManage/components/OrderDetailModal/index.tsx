import React, { useEffect, useRef, useState } from 'react';
import type { FormInstance } from 'antd';
import { Space } from 'antd';
import { Tag } from 'antd';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { orderDetail } from '../../service';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { payPlatformValueEnum } from '@/consts/valueEnums';
import CouponInfoModal from './CouponInfoModal';
import { Typography } from 'antd';
const { Link } = Typography;

type OrderDetailModalProps = {
  visible?: boolean;
  onCancel?: () => void;
  oid: number;
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

const OrderDetailModal: React.FC<OrderDetailModalProps> = (props) => {
  const formRef = useRef<FormInstance<any>>();
  const { visible, oid, onCancel, onSuccess } = props;

  const [userInfoDs, setUserInfoDs] = useState<any>();
  const [payInfoDs, setPayInfoDs] = useState<any>();
  const [cartDs, setCartDs] = useState<any>();
  const [couponModalVisible, setCouponModalVisible] = useState(false);
  const [couponInfo, setCouponInfo] = useState<any>();

  const handleCouponClick = () => {
    // 假设 `userCouponDTO` 是 `payInfoDs` 的一部分
    console.log('Coupon clicked, setting modal visible');
    setCouponModalVisible(true);
  };

  const fetchOrderDetail = async (id: number) => {
    const res = await orderDetail({ id: id });
    console.log('orderDetail', res);
    const {
      orderAddressDTO,
      payment,
      cartDTOS,
      packageFee,
      deliveryFee,
      serialNumber,
      deliveryTime,
      couponPrice,
      originalPrice,
      userCouponDTO,
    } = res.data || {};
    setUserInfoDs({ ...orderAddressDTO });
    setPayInfoDs({
      ...payment,
      packageFee,
      deliveryFee,
      serialNumber,
      deliveryTime,
      couponPrice,
      originalPrice,
    });
    setCouponInfo({
      ...(userCouponDTO || {}), // 如果 userCouponDTO 未定义，则使用空对象
      couponPrice: couponPrice,
      originalPrice: originalPrice,
    });
    setCartDs(cartDTOS);

    console.log('orderDetail', res);
  };

  useEffect(() => {
    formRef.current?.resetFields();
    formRef.current?.setFieldsValue({ oid });
  }, [oid]);

  return (
    <ModalForm<DataItem>
      title="订单详情"
      formRef={formRef}
      width={1100}
      layout="vertical"
      // labelCol={{ span: 8 }}
      wrapperCol={{ span: 24 }}
      onFinish={async (values) => {
        console.log(values);
        onSuccess?.();
        return true;
      }}
      visible={visible}
      onVisibleChange={async (v) => {
        if (v) {
          await fetchOrderDetail(oid);
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
        <ProDescriptions.Item dataIndex="originalPrice" label="商品总价" valueType="money" />
        <ProDescriptions.Item dataIndex="packageFee" label="打包费" valueType="money" />
        <ProDescriptions.Item dataIndex="deliveryFee" label="配送费" valueType="money" />
        <ProDescriptions.Item
          dataIndex="couponPrice"
          label="优惠券优惠"
          valueType="money"
          render={(value) => <Link onClick={handleCouponClick}>{value}</Link>}
        />
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
      <div style={{ fontWeight: 700, fontSize: 16 }}>订单明细</div>
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

      <CouponInfoModal
        visible={couponModalVisible}
        onClose={() => setCouponModalVisible(false)}
        couponInfo={couponInfo}
      />
    </ModalForm>
  );
};

export default OrderDetailModal;
