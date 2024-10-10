import React, { useEffect, useRef } from 'react';
import type { FormInstance } from '@ant-design/pro-form';
import {
  ModalForm,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import { Col, Row, Divider } from 'antd';

type MergeFormProps = {
  visible?: boolean;
  onCancel?: () => void;
  isEdit?: boolean;
  value?: any;
  onSuccess?: () => void;
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
      autoFocusFirstInput
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
        console.log(values);
        await handleSubmit(values, isEdit);
        message.success('操作成功');
        onSuccess?.();
        return true;
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
            label="卡券名称"
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
            precision={2}
            fieldProps={{
              step: 0.01,
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
          <ProFormDateTimePicker
            name="start"
            label="开始时间"
            rules={[{ required: true, message: '请选择开始时间' }]}
          />
        </Col>
      </Row>

      <Divider orientation="left">领取和使用规则</Divider>
      <Row gutter={16}>
        <Col span={12}>
          <ProFormRadio.Group
            {...requiredRule}
            name="deliveryFree"
            label="减免配送费"
            radioType="button"
            options={[
              { label: '是', value: true },
              { label: '否', value: false },
            ]}
            fieldProps={{
              style: { width: '100%' },
            }}
          />
        </Col>
        <Col span={12}>
          <ProFormRadio.Group
            {...requiredRule}
            name="packageFree"
            label="减免打包费"
            radioType="button"
            options={[
              { label: '是', value: true },
              { label: '否', value: false },
            ]}
            fieldProps={{
              style: { width: '100%' },
            }}
          />
        </Col>
      </Row>

      <Divider orientation="left">适用范围</Divider>
      <Row>
        <Col span={24}>
          <ProFormSelect
            labelCol={{ span: 3 }}
            {...requiredRule}
            request={async () => [
              { value: 'BUILDING_1', label: '建筑1' },
              { value: 'BUILDING_2', label: '建筑2' },
            ]}
            name="applicableBuildings"
            label="参与楼宇"
          />
        </Col>
      </Row>

      {/* 这里可以继续添加其他的表单分区 */}
    </ModalForm>
  );
};

export default MergeForm;

const handleSubmit = async (values: any, isEdit: boolean = false) => {
  // Placeholder for submit logic
  console.log('Submit', values);
  // return isEdit ? await updateItem(values) : await createItem(values);
};
