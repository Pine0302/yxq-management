import React, { useEffect, useRef, useState } from 'react';
import type { FormInstance, ProFormColumnsType } from '@ant-design/pro-form';
import { BetaSchemaForm } from '@ant-design/pro-form';
import { addKitchenLive, updateMenuUser, getAllGoodsClass } from '../service';
import { message, Select } from 'antd';
// import type { RequestOptionsType } from '@ant-design/pro-utils';

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
  contact: string;
  phone: string;
};

const handleSubmit = async (values: any) => {
  if (values?.id) {
    return await updateMenuUser(values);
  } else {
    return await addKitchenLive(values);
  }
};

const MergeForm: React.FC<MergeFormProps> = (props) => {
  const formRef = useRef<FormInstance<DataItem>>();
  const [cateOptions, setCateOptions] = useState([]);

  useEffect(() => {
    const fetchAllCates = async () => {
      const res = await getAllGoodsClass();
      const cates = res.data;
      // const cates = await [
      //   { id: 1, name: '热销套餐' },
      //   { id: 2, name: '素菜' },
      //   { id: 3, name: '主食' },
      // ];
      setCateOptions(cates.map((cate) => ({ label: cate.className, value: cate.id })));
    };

    fetchAllCates();

    if (props?.value) {
      // 这里可能需要转换 cates 数据为适合 Select 组件的形式
      const transformedCates = props.value.cates.map((cate) => cate.id);
      formRef.current?.setFieldsValue({ ...props.value, cates: transformedCates });
    } else {
      formRef.current?.resetFields();
    }
  }, [props.value]);

  const columns: ProFormColumnsType<DataItem>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      formItemProps: {
        hidden: true,
      },
    },
    {
      title: '编码',
      dataIndex: 'code',
      formItemProps: {},
      fieldProps: {
        disabled: props.isEdit, // 如果是编辑模式，则禁用输入
      },
    },
    {
      title: '栏目名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      fieldProps: {
        disabled: props.isEdit, // 如果是编辑模式，则禁用输入
      },
    },
    {
      title: '显示名称',
      dataIndex: 'showName',
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
      title: '排序号',
      dataIndex: 'sort',
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
      title: '是否显示',
      dataIndex: 'hidden',
      valueType: 'radioButton',
      valueEnum: {
        0: {
          text: '正常',
        },
        1: {
          text: '关闭',
        },
      },
      initialValue: '0',
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
    {
      title: '关联商品大类',
      dataIndex: 'cates',
      valueType: 'select',
      fieldProps: {
        mode: 'multiple',
        optionLabelProp: 'label',
        options: cateOptions,
      },
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
        visible={props?.visible} // 确保这里使用的是正确的属性名
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
