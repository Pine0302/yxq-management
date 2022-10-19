import { payPlatformValueEnum } from '@/consts/valueEnums';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Drawer, Tag } from 'antd';
import { useEffect, useState } from 'react';
import type { cartItemDTO } from '../data';
import { orderDetail } from '../service';
import styles from './style.less';

type OrderDetailDrawerProps = {
  visible: boolean;
  orderId: number;

  onCancel: () => void;
};

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
    valueType: 'money',
  },
];

const OrderDetailDrawer: React.FC<OrderDetailDrawerProps> = (props) => {
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [userInfoDs, setUserInfoDs] = useState<any>();
  const [payInfoDs, setPayInfoDs] = useState<any>();
  const [cartDs, setCartDs] = useState<any>();

  const detailRequest = async (id: number) => {
    setDetailLoading(true);
    const res = await orderDetail({ id: id });

    const { orderAddressDTO, payment, cartDTOS, packageFee, deliveryFee, serialNumber, deliveryTime } = res.data || {};
    setUserInfoDs({ ...orderAddressDTO });
    setPayInfoDs({ ...payment, packageFee, deliveryFee, serialNumber, deliveryTime });
    setCartDs(cartDTOS);

    setDetailLoading(false);
  };

  useEffect(() => {
    const fn = async (orderId: number) => {
      await detailRequest(orderId);
    };

    if (props.orderId) {
      fn(props.orderId);
    }
  }, [props.orderId]);

  return (
    <>
      <Drawer
        width={800}
        visible={props.visible}
        title={'订单详情'}
        onClose={() => {
          props.onCancel();
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
            render={(_, record) => {
              return (
                <>
                  <Tag color="processing">{record.label}</Tag>
                  {record.address} {record.building} {record.houseNumber}
                </>
              );
            }}
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
          <ProDescriptions.Item dataIndex="serialNumber" label="订单流水号" />
          <ProDescriptions.Item dataIndex="deliveryTime" label="预计送达时间" valueType='dateTime' />
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
    </>
  );
};

export default OrderDetailDrawer;
