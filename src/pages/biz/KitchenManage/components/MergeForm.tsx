import React, { useEffect, useRef } from 'react';
import type { FormInstance, ProFormColumnsType } from '@ant-design/pro-form';
import { BetaSchemaForm } from '@ant-design/pro-form';
import { addKitchen, editKitchen } from '../service';
import { message } from 'antd';
// import type { RequestOptionsType } from '@ant-design/pro-utils';

type MergeFormProps = {
  modalVisible?: boolean;
  onCancel?: () => void;
  isEdit?: boolean;
  value?: any;
  onSuccess?: () => void;
};

type DataItem = {
  id: number;
  name: string;
  contact: string;
  phone: string;
};

const handleSubmit = async (values: any) => {
  if (values?.id) {
    return await editKitchen(values);
  } else {
    return await addKitchen(values);
  }
};

const columns: ProFormColumnsType<DataItem>[] = [
  {
    title: 'id',
    dataIndex: 'id',
    formItemProps: {
      hidden: true,
    },
  },
  {
    title: '名称',
    dataIndex: 'name',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
  },
  {
    title: '联系人',
    dataIndex: 'contact',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
  },
  {
    title: '电话',
    dataIndex: 'phone',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    valueType: 'radioButton',
    valueEnum: {
      OK: {
        text: '正常',
      },
      CLOSE: {
        text: '关闭',
      },
    },
    initialValue: 'OK',
    // request: async () => {
    //   return [
    //     { label: '正常', value: 'OK' },
    //     { label: '关闭', value: 'CLOSE' },
    //   ] as RequestOptionsType[];
    // },
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
  },
];

const MergeForm: React.FC<MergeFormProps> = (props) => {
  const formRef = useRef<FormInstance<DataItem>>();
  useEffect(() => {
    if (props?.value) formRef.current?.setFieldsValue(props.value);
    else formRef.current?.resetFields();
  }, [props.value]);

  return (
    <>
      <BetaSchemaForm<DataItem>
        title={props?.isEdit ? '编辑厨房' : '新增厨房'}
        formRef={formRef}
        width={500}
        layout="horizontal"
        layoutType="ModalForm"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 24 }}
        onFinish={async (values) => {
          console.log(values);
          await handleSubmit(values);
          message.success('操作成功');
          props?.onSuccess?.();
          return true;
        }}
        columns={columns}
        visible={props?.modalVisible}
        onVisibleChange={(v) => {
          if (!v) {
            props?.onCancel?.();
          }
        }}
      />
    </>
  );
};

export default MergeForm;
