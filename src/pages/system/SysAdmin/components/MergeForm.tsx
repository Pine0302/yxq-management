import React, { useEffect, useRef, useState } from 'react';
import type { FormInstance, ProFormColumnsType } from '@ant-design/pro-form';
import { BetaSchemaForm } from '@ant-design/pro-form';
import { message, Radio, Input } from 'antd';
import { addSystemAdmin, updateSystemAdmin } from '../service';
import { SystemAdmin } from '../data.d';

import type { UploadFile } from 'antd/lib/upload/interface';
import 'antd/dist/antd.css'; // 确保正确导入antd样式
import 'antd/es/upload/style/index.css';

type MergeFormProps = {
  visible?: boolean;
  onCancel?: () => void;
  isEdit?: boolean;
  viewMode?: boolean; // 新增属性，用于查看模式
  value?: any;
  onSuccess?: () => void;
};

const handleSubmit = async (values: any, isEdit: boolean = false) => {
  console.log('values', values);
  console.log('isEdit', isEdit);
  if (!isEdit) {
    return await addSystemAdmin(values);
  } else {
    return await updateSystemAdmin(values);
  }
};

const MergeForm: React.FC<MergeFormProps> = (props) => {
  const formRef = useRef<FormInstance<SystemAdmin>>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (props?.value) {
      formRef.current?.setFieldsValue(props.value);
    } else {
      formRef.current?.resetFields();
      setFileList([]);
    }

    return () => {
      setFileList([]);
    };
  }, [props.value]);

  const columns: ProFormColumnsType<SystemAdmin>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      formItemProps: {
        hidden: true,
      },
    },
    {
      title: '姓名',
      dataIndex: 'realName',
      renderFormItem: (item, { defaultRender }) => {
        return <Input {...item} disabled={props.viewMode} placeholder="请输入姓名" />;
      },
      formItemProps: {
        rules: [{ required: true }],
      },
    },
    {
      title: '登录账号',
      dataIndex: 'account',
      renderFormItem: (item, { defaultRender }) => {
        return (
          <Input
            {...item}
            disabled={props.viewMode}
            placeholder="由a~z，0~9任意组成，不超过20个字符"
          />
        );
      },
      formItemProps: {
        rules: [
          { required: true, message: '请输入登录账号' },
          { pattern: /^[a-zA-Z0-9]+$/, message: '登录账号只能包含英文字母和数字' },
          { max: 20, message: '登录账号不能超过20个字符' },
        ],
      },
    },

    {
      title: '手机号',
      dataIndex: 'phone',
      renderFormItem: (item, { defaultRender }) => {
        return <Input {...item} disabled={props.viewMode} placeholder="请输入手机号" />;
      },
      formItemProps: {
        rules: [
          { required: true, message: '请输入手机号' },
          { pattern: /^\d{10,11}$/, message: '请输入有效的手机号' },
        ],
      },
    },

    {
      title: '职务',
      dataIndex: 'position',
      renderFormItem: (item, { defaultRender }) => {
        return <Input {...item} disabled={props.viewMode} placeholder="" />;
      },
      formItemProps: {
        rules: [{ required: true }],
      },
    },

    {
      title: '登录密码',
      dataIndex: 'password',
      renderFormItem: (item, { defaultRender }) => {
        return (
          <Input
            {...item}
            disabled={props.viewMode || props.isEdit}
            placeholder="密码由8-20位a-z，0-9，特殊符号的任意两种及以上组成"
          />
        );
      },
      formItemProps: {
        rules: props.isEdit
          ? []
          : [
              // 如果是编辑模式，则不设校验规则
              { required: true, message: '请输入密码' },
              {
                pattern:
                  /^(?:(?=.*\d)(?=.*[a-zA-Z])|(?=.*\d)(?=.*[^a-zA-Z0-9])|(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]))[A-Za-z\d\W]{8,20}$/,
                message: '密码必须由8-20位英文字母，数字，特殊符号的任意两种及以上组成',
              },
            ],
      },
    },
    {
      title: '状态',
      dataIndex: 'statusInt',
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        return (
          <Radio.Group>
            <Radio value={1}>启用</Radio>
            <Radio value={0}>禁用</Radio>
          </Radio.Group>
        );
      },
      formItemProps: {
        rules: [{ required: true, message: '请选择状态' }],
        initialValue: 1, // 设置初始值，确保加载表单时有默认值
        valuePropName: 'value', // 确保Radio.Group使用的属性是value
      },
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
      renderFormItem: (item, { defaultRender }) => {
        return <Input {...item} disabled={props.viewMode} placeholder="" />;
      },
      formItemProps: {
        rules: [{ required: false }],
      },
    },
    {
      title: '所属公司',
      dataIndex: 'company',
      renderFormItem: (item, { defaultRender }) => {
        return <Input {...item} disabled={true} placeholder="一鲜七" />;
      },
      formItemProps: {
        rules: [{ required: false }],
      },
    },
    {
      title: '部门',
      dataIndex: 'dept',
      renderFormItem: (item, { defaultRender }) => {
        return <Input {...item} disabled={props.viewMode} placeholder="" />;
      },
      formItemProps: {
        rules: [{ required: false }],
      },
    },
  ];

  return (
    <>
      <BetaSchemaForm<SystemAdmin>
        //title={props?.isEdit ? '编辑账号' : '新增账号'}
        title={props?.viewMode ? '查看账号' : props?.isEdit ? '编辑账号' : '新增账号'}
        formRef={formRef}
        width={500}
        layout="horizontal"
        layoutType="ModalForm"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 22 }}
        onFinish={async (values) => {
          if (props?.viewMode) {
            return true; // 在查看模式下，不执行提交
          }
          try {
            const formData = {
              ...values,
            };
            console.log(formData);
            await handleSubmit(values, props?.isEdit);
            message.success('操作成功');
            props?.onSuccess?.();
            return true;
          } catch (error) {
            if (error instanceof Error) {
              console.table(error);
              message.error(`操作失败: ${error.data.msg}`);
            } else {
              message.error('操作失败');
            }
            return false;
          }
        }}
        columns={columns}
        visible={props?.visible}
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
