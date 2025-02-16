import React, { useRef } from 'react';
import type { FormInstance } from 'antd';

import { Tag } from 'antd';
import { DrawerForm } from '@ant-design/pro-form';
import ProDescriptions from '@ant-design/pro-descriptions';

import type { TableListItem } from '../data';

type CouponDetailModalProps = {
  visible?: boolean;
  record: Partial<TableListItem>;
  onCancel?: () => void;
};

type DataItem = {
  id: number;
  pid: number;
  name: string;
  image: string;
  sort: number;
  del: string;
};

const CouponDetailForm: React.FC<CouponDetailModalProps> = (props) => {
  const formRef = useRef<FormInstance<any>>();
  const { visible, record, onCancel } = props;
  console.log('value', record);

  return (
    <DrawerForm<DataItem>
      title="优惠券详情"
      formRef={formRef}
      width={900}
      layout="vertical"
      visible={visible}
      onVisibleChange={(isVisible) => {
        if (!isVisible) {
          onCancel?.();
        }
      }}
      drawerProps={{
        placement: 'right',
        onClose: () => onCancel?.(),
      }}
      submitter={false}
    >
      <ProDescriptions<any> column={3} dataSource={record} title="| 基本信息">
        <ProDescriptions.Item dataIndex="name" label="卡券名称" />
        <ProDescriptions.Item
          dataIndex="type"
          label="卡券类型"
          render={(_, item) => {
            return (
              <span>
                {item.type === 'FULL_REDUCE'
                  ? '满减券'
                  : item.type === 'DISCOUNT'
                  ? '折扣券'
                  : '未知类型'}
              </span>
            );
          }}
        />
        <ProDescriptions.Item
          dataIndex="sendStatus"
          label="卡券状态"
          render={(_, item) => {
            switch (item.sendStatus) {
              case 0:
                return <Tag color="default">未投放</Tag>;
              case 1:
                return <Tag color="processing">已投放</Tag>;
              case 2:
                return <Tag color="warning">已结束</Tag>;
              default:
                return <Tag color="default">未知状态</Tag>;
            }
          }}
        />
        <ProDescriptions.Item
          dataIndex="reduce"
          label="面值"
          render={(_, item) => {
            return item.type === 'FULL_REDUCE' ? `￥${item.reduce}` : `${item.discount}折`;
          }}
        />
        <ProDescriptions.Item
          dataIndex="reduce"
          label="门槛金额"
          render={(_, item) => {
            return `￥${item.payFull}`;
          }}
        />
        <ProDescriptions.Item
          dataIndex="reduce"
          label="投放总数"
          render={(_, item) => {
            return `${item.sendAmount}`;
          }}
        />
        <ProDescriptions.Item
          dataIndex="remark"
          label="使用规则"
          render={(_, item) => {
            return `${item.remark}`;
          }}
        />
        <ProDescriptions.Item
          dataIndex="sendTime"
          label="投放时间"
          render={(_, item) => {
            return `${item.sendTime}`;
          }}
        />
        <ProDescriptions.Item
          dataIndex="sendType"
          label="投放领取方式"
          render={(_, item) => {
            switch (item.sendType) {
              case 'PLATFORM':
                return <Tag color="default">平台投放</Tag>;
              case 'SCENE':
                return <Tag color="processing">场景触发时领取</Tag>;
              case 'PUBLIC':
                return <Tag color="warning">公开投放</Tag>;
              default:
                return <Tag color="default">未知状态</Tag>;
            }
          }}
        />
      </ProDescriptions>

      <ProDescriptions<any> column={3} dataSource={record} title="| 领取和使用规则">
        <ProDescriptions.Item
          label="每人限领次数"
          valueType="text"
          fieldProps={{
            value: '1人/次',
          }}
        />
        <ProDescriptions.Item
          label="领取时限"
          valueType="text"
          fieldProps={{
            value: '不限',
          }}
        />
        <ProDescriptions.Item
          dataIndex="useDuration"
          label="用券有效时间"
          render={(_, item) => {
            return `领券后 ${item.useDuration} 天`;
          }}
        />
      </ProDescriptions>

      <ProDescriptions<any> column={3} dataSource={record} title="| 使用范围">
        <ProDescriptions.Item
          label="减免配送费"
          dataIndex="deliveryFee"
          render={(_, item) => {
            return item.deliveryFee === false ? `否` : `是`;
          }}
        />
        <ProDescriptions.Item
          label="减免打包费"
          dataIndex="packageFee"
          render={(_, item) => {
            return item.packageFee === false ? `否` : `是`;
          }}
        />
        <ProDescriptions.Item />
        <ProDescriptions.Item
          label="适用商品"
          valueType="text"
          fieldProps={{
            value: '不限',
          }}
        />
        <ProDescriptions.Item />
        <ProDescriptions.Item />
        <ProDescriptions.Item
          dataIndex="activityAreas"
          label="适用楼宇"
          render={(_, item) => {
            if (!item.activityAreas || item.activityAreas.length === 0) {
              return <Tag>通用</Tag>;
            }
            return (
              <>
                {item.activityAreas.map((area: any) => (
                  <Tag key={area.id}>{area.areaName}</Tag>
                ))}
              </>
            );
          }}
        />
      </ProDescriptions>

      <ProDescriptions<any> column={3} dataSource={record} title="| 叠加使用">
        <ProDescriptions.Item
          label="是否允许叠加"
          valueType="text"
          fieldProps={{
            value: '不可和其他优惠券叠加使',
          }}
        />
      </ProDescriptions>

      <ProDescriptions<any> column={1} dataSource={record} title="| 短信提醒">
        <ProDescriptions.Item
          label="领取提醒"
          dataIndex="receiveRemind"
          render={(_, item) => {
            return item.receiveRemind === 1 ? '有短信提醒' : '无短信提醒';
          }}
        />

        <ProDescriptions.Item
          label="过期提醒"
          dataIndex={['expireRemind', 'expireRemindDays']}
          render={(_, item) => {
            if (item.expireRemind === 0) {
              return <span>无过期提醒</span>;
            } else if (item.expireRemind === 1) {
              return (
                <span>
                  过期前 <Tag color="blue">{item.expireRemindDays}</Tag> 天提醒
                </span>
              );
            } else {
              return <span>未知状态</span>;
            }
          }}
        />
      </ProDescriptions>
    </DrawerForm>
  );
};

export default CouponDetailForm;
