import React, { useEffect, useRef } from 'react';
import type { FormInstance } from '@ant-design/pro-form';
import ProForm from '@ant-design/pro-form';
import {
  ModalForm,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormDependency,
  ProFormDatePicker,
  ProFormCheckbox,
} from '@ant-design/pro-form';
import { Col, Row, Divider, message, Checkbox, Input, Space } from 'antd';

import { buildingPageInfo } from '../../../../biz/BuildingManage/service';
import type { RequestOptionsType } from '@ant-design/pro-utils';
import { addCoupon, editCoupon } from '../service';

type MergeFormProps = {
  visible?: boolean;
  onCancel?: () => void;
  isEdit?: boolean;
  value?: any;
  onSuccess?: () => void;
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
const handleSubmit = async (values: any, isEdit: boolean = false) => {
  // Placeholder for submit logic
  console.log('Submit', values);
  console.log('Submit-valu_id', values?.id);
  if (!values?.id) {
    console.log('add');
    return await addCoupon(values);
  } else {
    console.log('edit');
    return await editCoupon(values);
  }
  // return isEdit ? await updateItem(values) : await createItem(values);
};

const requiredRule = { rules: [{ required: true }] };

const MergeForm: React.FC<MergeFormProps> = ({ visible, onCancel, isEdit, value, onSuccess }) => {
  const formRef = useRef<FormInstance<any>>();

  useEffect(() => {
    if (value) {
      formRef.current?.setFieldsValue(value);
    } else {
      formRef.current?.resetFields();
    }
  }, [value]);

  return (
    <ModalForm
      title={isEdit ? '编辑优惠券' : '新增优惠券'}
      formRef={formRef}
      layout="horizontal"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      modalProps={{
        destroyOnClose: true,
        onCancel: onCancel,
        bodyStyle: { maxHeight: '80vh', overflow: 'auto' },
      }}
      visible={visible}
      onFinish={async (values) => {
        try {
          if (values.applicableBuildingsType === 'all') {
            values.fixedArea = '-1'; // 如果选择了通用，将 fixedArea 设置为 -1
          } else if (values.applicableBuildingsType === 'specific') {
            values.fixedArea = values.fixedArea.join(','); // 如果是指定楼宇，确保 fixedArea 是一个字符串
          }
          console.log('开始提交');
          await handleSubmit(values, isEdit);
          message.success('提交成功');
          if (onSuccess) {
            onSuccess(); // 调用 onSuccess 回调函数
          } else {
            window.location.reload(); // 刷新页面
          }
        } catch (error) {
          console.error('提交失败:', error);
          message.error('提交失败，请重试');
        }
      }}
    >
      <Divider orientation="left">基本信息</Divider>
      <Row>
        <Col span={16}>
          <ProFormSelect
            {...requiredRule}
            request={async () => [
              { value: 'DISCOUNT', label: '折扣券' },
              { value: 'FULL_REDUCE', label: '满减券' },
            ]}
            name="type"
            label="卡券类型"
          />
        </Col>
      </Row>

      <Row>
        <Col span={16}>
          <ProFormText
            name="name"
            label="券名称"
            placeholder="请输入卡券名称，限20字"
            fieldProps={{
              maxLength: 20,
              showCount: true,
            }}
            rules={[
              { required: true, message: '请输入卡券名称' },
              { max: 20, message: '卡券名称不能超过20个字符' },
            ]}
          />
        </Col>
      </Row>

      <Row>
        <Col span={16}>
          <ProFormDigit
            label="总投放数"
            name="totalAmount"
            width="sm"
            min={1}
            rules={[{ required: true, message: '请输入总投放数' }]}
          />
        </Col>
      </Row>
      <Row>
        <Col span={16}>
          <ProFormDigit
            label="面值"
            name="reduce"
            width="sm"
            min={0}
            fieldProps={{
              step: 0.01,
              precision: 2,
            }}
            rules={[
              { required: true, message: '请输入面值' },
              { type: 'number', min: 0, message: '面值不能为负数' },
            ]}
          />
        </Col>
      </Row>

      <Row>
        <Col span={16}>
          <ProFormDigit
            label="门槛金额"
            name="payFull"
            placeholder="订单满 x 可用，数量不能为且不能低于面值金额"
            fieldProps={{
              style: { width: '100%' },
            }}
            rules={[
              { required: true, message: '请输入门槛金额' },
              { type: 'number', min: 0, message: '门槛金额不能为负数' },
              // 这里可以添加自定义验证规则来确保门槛金额不低于面值金额
            ]}
          />
        </Col>
      </Row>

      <Row>
        <Col span={16}>
          <ProFormText
            name="remark"
            label="使用规则："
            placeholder="满xx元可用"
            rules={[{ required: true, message: '请输入使用规则说明' }]}
          />
        </Col>
      </Row>

      <Divider orientation="left">领取和使用规则</Divider>
      <ProFormRadio.Group
        name="receiveTimeLimit"
        label="领取时限："
        labelCol={{ span: 4 }} // 控制标签的宽度
        wrapperCol={{ span: 20 }} // 控制输入框的宽度
        options={[
          { label: '不限日期，投放后长期可用', value: 'unlimited' },
          { label: '固定日期', value: 'fixed', disabled: true }, // 禁用固定日期选项
        ]}
        initialValue="unlimited" // 设置默认值为不限制
        rules={[{ required: true, message: '请选择领取时限' }]}
      />
      <ProFormDependency name={['receiveTimeLimit']}>
        {({ receiveTimeLimit }) => {
          if (receiveTimeLimit === 'fixed') {
            return (
              <>
                <ProFormDatePicker
                  name="receiveStartTime"
                  label="开始时间"
                  labelCol={{ span: 4 }} // 控制标签的宽度
                  wrapperCol={{ span: 20 }} // 控制输入框的宽度
                  rules={[{ required: true, message: '请选择开始时间' }]}
                />
                <ProFormDatePicker
                  name="receiveEndTime"
                  label="结束时间"
                  labelCol={{ span: 4 }} // 控制标签的宽度
                  wrapperCol={{ span: 20 }} // 控制输入框的宽度
                  rules={[{ required: true, message: '请选择结束时间' }]}
                />
              </>
            );
          }
          return null;
        }}
      </ProFormDependency>

      <ProFormDigit
        name="limitPerUser"
        label="每人限领次数："
        labelCol={{ span: 4 }} // 控制标签的宽度
        wrapperCol={{ span: 20 }} // 控制输入框的宽度
        initialValue={1} // 默认值为1
        min={1} // 最小值为1
        fieldProps={{
          formatter: (val) => `${val}`, // 将 value 改为 val
          disabled: true, // 禁用输入框
          style: { width: '100px' }, // 设置输入框宽度
        }}
        rules={[{ required: true, message: '请输入每人限领次数' }]}
      />

      <Row>
        <Col span={24}>
          <ProFormDigit
            name="useDuration"
            label="用券有效时间："
            placeholder="请输入用有效时间（天）"
            min={1} // 最小值为1
            labelCol={{ span: 4 }} // 控制标签的宽度
            wrapperCol={{ span: 20 }} // 控制输入框的宽度
            fieldProps={{
              style: { width: '100px' }, // 设置输入框宽度
            }}
            rules={[{ required: true, message: '请输入用券有效时间' }]}
          />
        </Col>
      </Row>

      <Divider orientation="left">使用范围</Divider>
      <Row gutter={16}>
        <Col span={12}>
          <ProFormRadio.Group
            {...requiredRule}
            name="deliveryFree"
            label="减免配送费"
            labelCol={{ span: 8 }} // 控制标签的宽度
            wrapperCol={{ span: 16 }} // 控制输入框的宽度
            radioType="button"
            options={[
              { label: '是', value: true },
              { label: '否', value: false },
            ]}
          />
        </Col>
        <Col span={12}>
          <ProFormRadio.Group
            {...requiredRule}
            name="packageFree"
            label="减免打包费"
            labelCol={{ span: 8 }} // 控制标签的宽度
            wrapperCol={{ span: 16 }} // 控制输入框的宽度
            radioType="button"
            options={[
              { label: '是', value: true },
              { label: '否', value: false },
            ]}
          />
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <ProFormRadio.Group
            name="gids"
            label="适用商品"
            labelCol={{ span: 4 }} // 控制标签的宽度
            wrapperCol={{ span: 20 }} // 控制输入框的宽度
            options={[
              { label: '全部', value: '-1' },
              // { label: '部分', value: 'partial' },
            ]}
            initialValue="-1" // 默认选择全部
            rules={[{ required: true, message: '请选择适用商品' }]}
          />
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <ProFormRadio.Group
            name="applicableBuildingsType"
            label="适用楼宇"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            options={[
              { label: '通用', value: 'all' },
              { label: '指定楼宇', value: 'specific' },
            ]}
            initialValue="all"
            rules={[{ required: true, message: '请选择适用楼类型' }]}
          />
        </Col>
      </Row>

      <ProFormDependency name={['applicableBuildingsType']}>
        {({ applicableBuildingsType }) => {
          if (applicableBuildingsType === 'specific') {
            return (
              <Row>
                <Col span={24}>
                  <ProFormSelect
                    name="fixedArea"
                    label="参与楼宇"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    mode="multiple"
                    request={buildingSelectRequest}
                    fieldProps={{
                      placeholder: '请选择参与楼宇',
                    }}
                    rules={[{ required: true, message: '请选择参与楼宇' }]}
                  />
                </Col>
              </Row>
            );
          }
          return null;
        }}
      </ProFormDependency>

      <Divider orientation="left">叠加使用</Divider>
      <Row gutter={16}>
        <Col span={24}>
          <ProFormRadio.Group
            name="multiple"
            label="是否允许叠加"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            options={[
              // { label: '是', value: true },
              { label: '否', value: 0 },
            ]}
            initialValue={0} // 默认选择否
            rules={[{ required: true, message: '请选择是否允许叠加' }]}
          />
        </Col>
      </Row>

      <Divider orientation="left">短信提醒</Divider>
      <Row gutter={16}>
        <Col span={24}>
          <ProFormCheckbox
            name="receiveRemind"
            label="领取提醒："
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 20 }}
            initialValue={true}
            transform={(checked) => ({ receiveRemind: checked ? '1' : '0' })} // 确保转换后的值被正确传递
          >
            领取成功时提醒
          </ProFormCheckbox>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <ProForm.Group>
            <ProFormCheckbox
              name="expireRemind"
              initialValue={true}
              label="过期提醒："
              labelCol={{ span: 12 }}
              wrapperCol={{ span: 20 }}
              transform={(checked) => ({ expireRemind: checked ? '1' : '0' })} // 确保转换后的值被正确传递
            >
              到期
            </ProFormCheckbox>
            <ProFormDigit
              name="expireRemindDays"
              width="xs"
              min={1}
              max={30}
              initialValue={3}
              fieldProps={{
                addonAfter: '天前提醒',
                style: { width: '50px' },
              }}
              label=""
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 20 }}
            />
          </ProForm.Group>
        </Col>
      </Row>
    </ModalForm>
  );
};

export default MergeForm;
