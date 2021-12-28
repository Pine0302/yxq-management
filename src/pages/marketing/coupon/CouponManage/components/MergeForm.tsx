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
import { Col, message, Row } from 'antd';

type MergeFormProps = {
  visible?: boolean;
  onCancel?: () => void;
  isEdit?: boolean;
  value?: any;
  onSuccess?: () => void;
};

type DataItem = {
  id: number;
  name: string;
  phone: string;
  isAdmin: boolean;
  areaId: number;
};

const handleSubmit = async (values: any, isEdit: boolean = false) => {
  if (!isEdit) {
    // return await addKitchenUser(values);
  } else {
    // return await updateKitchenUser(values);
  }
};

// const kitchenSelectRequest = async () => {
// const res = await kitchenPageInfo({ current: 1, pageNum: 1, pageSize: 1000 });
// const zh = (res?.data?.list || []).map((v) => {
//   return {
//     label: v.name,
//     value: v.id,
//   };
// }) as RequestOptionsType[];
// return zh;
// };

const requiredRule = { rules: [{ required: true }] };

const MergeForm: React.FC<MergeFormProps> = (props) => {
  const formRef = useRef<FormInstance<DataItem>>();
  useEffect(() => {
    if (props?.value) formRef.current?.setFieldsValue(props.value);
    else formRef.current?.resetFields();
  }, [props.value]);

  return (
    <>
      <ModalForm
        title={props?.isEdit ? '编辑优惠券' : '新增优惠券'}
        formRef={formRef}
        autoFocusFirstInput
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 24 }}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => props?.onCancel?.(),
        }}
        visible={props?.visible}
        onFinish={async (values) => {
          console.log(values);
          await handleSubmit(values, props?.isEdit);
          message.success('操作成功');
          props?.onSuccess?.();
          return true;
        }}
      >
        <Row gutter={[0, 0]}>
          <Col span={12}>
            <ProFormText name="name" label="优惠券名称" {...requiredRule} />
          </Col>
          <Col span={12}>
            <ProFormSelect
              {...requiredRule}
              request={async () => [
                {
                  value: 'DISCOUNT',
                  label: '折扣券',
                },
                {
                  value: 'FULL_REDUCE',
                  label: '满减券',
                },
              ]}
              name="type"
              label="类型"
            />
          </Col>
          <Col span={12}>
            <ProFormRadio.Group
              {...requiredRule}
              name="radio-button"
              label="减免配送费"
              radioType="button"
              options={[
                {
                  label: '是',
                  value: true,
                },
                {
                  label: '否',
                  value: false,
                },
              ]}
            />
          </Col>
          <Col span={12}>
            <ProFormRadio.Group
              {...requiredRule}
              name="radio-button-ss"
              label="减免打包费"
              radioType="button"
              options={[
                {
                  label: '是',
                  value: true,
                },
                {
                  label: '否',
                  value: false,
                },
              ]}
            />
          </Col>
          <Col span={12}>
            {/* <ProFormText name="name2" label="总投放数" {...requiredRule} /> */}
            <ProFormDigit label="总投放数" name="name2" width="sm" min={1} {...requiredRule} />
          </Col>
          <Col span={12}>
            {/* <ProFormText name="name3" label="每人限额" {...requiredRule} /> */}
            <ProFormDigit label="每人限额" name="name3" width="sm" min={0} {...requiredRule} />
          </Col>
          <Col span={12}>
            <ProFormDateTimePicker name="start" label="开始时间" {...requiredRule} />
          </Col>
          <Col span={12}>
            <ProFormDateTimePicker name="end" label="结束时间" {...requiredRule} />
          </Col>
          <Col span={12}>
            <ProFormText name="name22" label="折扣" {...requiredRule} />
          </Col>
          <Col span={12}>
            <ProFormRadio.Group
              {...requiredRule}
              name="radio-button-ss2"
              label="减免打包费"
              radioType="button"
              initialValue={false}
              options={[
                {
                  label: '启用',
                  value: true,
                },
                {
                  label: '禁用',
                  value: false,
                },
              ]}
            />
          </Col>
          <Col span={24}>
            <ProFormSelect
              labelCol={{ span: 3 }}
              {...requiredRule}
              request={async () => [
                {
                  value: 'DISCOUNT',
                  label: '折扣券',
                },
                {
                  value: 'FULL_REDUCE',
                  label: '满减券',
                },
              ]}
              name="aaa"
              label="参与楼宇"
            />
          </Col>
          <Col span={24}>
            <ProFormSelect
              labelCol={{ span: 3 }}
              {...requiredRule}
              request={async () => [
                {
                  value: 'DISCOUNT',
                  label: '折扣券',
                },
                {
                  value: 'FULL_REDUCE',
                  label: '满减券',
                },
              ]}
              name="bbb"
              label="参与商品"
            />
          </Col>
        </Row>
      </ModalForm>
    </>
  );
};

export default MergeForm;
