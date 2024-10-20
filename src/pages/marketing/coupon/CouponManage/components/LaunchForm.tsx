import React, { useEffect, useRef } from 'react';
import type { FormInstance } from '@ant-design/pro-form';
import {
  ModalForm,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormDependency,
  ProFormDatePicker,
  ProFormTextArea,
  ProFormCheckbox,
} from '@ant-design/pro-form';
import { Col, Row, Divider, message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import { addCoupon, sendEstimate, sendCoupon } from '../service';

type LaunchFormProps = {
  visible?: boolean;
  onCancel?: () => void;
  isEdit?: boolean;
  value?: any;
  onSuccess?: () => void;
};

const handleSubmit = async (values: any) => {
  // Placeholder for submit logic
  console.log('Submit', values);
  console.log('Submit-valu_id', values?.id);
  if (!values?.id) {
    console.log('add');
    return await addCoupon(values);
  } else {
    console.log('send');
    return await sendCoupon(values);
  }
  // return isEdit ? await updateItem(values) : await createItem(values);
};

const requiredRule = { rules: [{ required: true }] };

const LaunchForm: React.FC<LaunchFormProps> = ({ visible, onCancel, value, onSuccess }) => {
  const formRef = useRef<FormInstance<any>>();

  // useEffect(() => {
  //   if (value) {
  //     formRef.current?.setFieldsValue(value);
  //   } else {
  //     formRef.current?.resetFields();
  //   }
  // }, [value]);

  useEffect(() => {
    if (visible && value) {
      formRef.current?.setFieldsValue(value);
    } else if (visible) {
      formRef.current?.resetFields();
    }
  }, [value, visible]); // 添加 visible 作为依赖项

  return (
    <ModalForm
      title={'投放优惠券'}
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
          // 调用 sendEstimate 接口获取预计投放人数
          const estimateResult = await sendEstimate(values);
          console.log('estimateResult', estimateResult);
          const estimatedCount = estimateResult.data.number; // 假设接口返回的数据中包含预计人数

          Modal.confirm({
            title: '确认投放',
            icon: <ExclamationCircleOutlined />,
            content: `预计投放人数：${estimatedCount}。您确定要投放这些优惠券吗？`,
            okText: '确定',
            cancelText: '取消',
            onOk: async () => {
              try {
                console.log('开始提交');
                const result = await handleSubmit(values);
                if (result.code === 200 && result.success) {
                  const { realNumber, failNumber } = result.data;
                  if (realNumber === 0 && failNumber === 0) {
                    message.success('投放成功！');
                  } else {
                    message.success(`投放成功！共赠送成功${realNumber}人，失败${failNumber}人`);
                  }
                  if (onSuccess) {
                    onSuccess();
                  } else {
                    window.location.reload();
                  }
                } else {
                  message.error('提交失败，请重试');
                }
              } catch (error) {
                console.error('提交失败:', error);
                message.error('提交失败，请重试');
              }
            },
          });
        } catch (error) {
          console.error('获取预计投放人数失败:', error);
          message.error('获取预计投放人数失败，请重试');
        }
        return false; // 阻止 ModalForm 自动关闭
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
            disabled={true} // 设置为不可更改
          />
        </Col>
      </Row>
      <Row>
        <Col span={16}>
          <ProFormText
            name="id"
            label="券id"
            disabled={true} // 设置为不可更改
            hidden={true} // 隐藏字段
          />
        </Col>
      </Row>
      <Row>
        <Col span={16}>
          <ProFormText
            name="name"
            label="券名称"
            disabled={true} // 设置为不可更改
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
          <ProFormText
            name="remark"
            label="使用规则："
            disabled={true} // 设置为不可更改
            placeholder="满xx元可用"
            rules={[{ required: true, message: '请输入使用规则说明' }]}
          />
        </Col>
      </Row>

      <Divider orientation="left">投放优优惠券</Divider>

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
          <ProFormRadio.Group
            label="投放领取方式"
            name="sendType"
            options={[
              { label: '平台赠送', value: 'PLATFORM' },
              { label: '场景触发时领取', value: 'SCENE' },
              { label: '公开投放（建设中）', value: 'PUBLIC', disabled: true },
            ]}
            initialValue="SCENE"
            rules={[{ required: true, message: '请选择投放领取方式' }]}
            fieldProps={{
              onChange: (e) => {
                if (e.target.value === 'SCENE') {
                  formRef.current?.setFieldsValue({ sceneType: ['NEW_REGISTER'] });
                } else {
                  formRef.current?.setFieldsValue({ sceneType: [] });
                }
              },
            }}
          />
        </Col>
      </Row>

      <ProFormDependency name={['sendType']}>
        {({ sendType }) => {
          if (sendType === 'SCENE') {
            return (
              <Row>
                <Col span={16}>
                  <ProFormCheckbox.Group
                    name="sceneType"
                    label="场景选择"
                    options={[{ label: '新用户注册成功时，自动领取', value: 'NEW_REGISTER' }]}
                    rules={[{ required: true, message: '请选择场景' }]}
                  />
                </Col>
              </Row>
            );
          }
          return null;
        }}
      </ProFormDependency>

      <ProFormDependency name={['sendType', 'userChoose']}>
        {({ sendType, userChoose }) => {
          if (sendType !== 'SCENE') {
            return (
              <>
                <Row>
                  <Col span={16}>
                    <ProFormRadio.Group
                      label="赠送对象"
                      name="userChoose"
                      options={[
                        { label: '全部用户', value: '1' },
                        { label: '输入手机号', value: '2' },
                      ]}
                      initialValue="1"
                      rules={[{ required: true, message: '请选择赠送对象' }]}
                    />
                  </Col>
                </Row>

                {userChoose === '2' && (
                  <Row>
                    <Col span={24}>
                      <ProFormTextArea
                        name="mobiles"
                        label="输入手机号"
                        placeholder="多个用户时，用逗号隔开(,)"
                        rules={[{ required: true, message: '请输入手机号' }]}
                      />
                    </Col>
                  </Row>
                )}
              </>
            );
          }
          return null;
        }}
      </ProFormDependency>

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

      <Row>
        <Col span={16}>
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
    </ModalForm>
  );
};

export default LaunchForm;
