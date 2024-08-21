import React, { useEffect, useRef, useState } from 'react';
import type { FormInstance, ProFormColumnsType } from '@ant-design/pro-form';
import { BetaSchemaForm } from '@ant-design/pro-form';
import { message, Radio, Input } from 'antd';
import { addSystemAdmin, updateSystemUserPwd } from '../service';
import { SystemAdmin } from '../data';

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
  return await updateSystemUserPwd(values);
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
      title: '输入新密码',
      dataIndex: 'password',
      renderFormItem: (item, { defaultRender }) => {
        return (
          <Input
            {...item}
            disabled={props.viewMode}
            placeholder="密码由8-20位a-z，0-9，特殊符号的任意两种及以上组成"
          />
        );
      },
      formItemProps: {
        rules: [
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
      title: '确认密码',
      dataIndex: 'passwordConfirm',
      renderFormItem: (item, { defaultRender }) => {
        return (
          <Input
            {...item}
            disabled={props.viewMode}
            placeholder="密码由8-20位a-z，0-9，特殊符号的任意两种及以上组成"
          />
        );
      },
      formItemProps: {
        rules: [
          { required: true, message: '请输入确认密码' },
          {
            pattern:
              /^(?:(?=.*\d)(?=.*[a-zA-Z])|(?=.*\d)(?=.*[^a-zA-Z0-9])|(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]))[A-Za-z\d\W]{8,20}$/,
            message: '密码必须由8-20位英文字母，数字，特殊符号的任意两种及以上组成',
          },
        ],
      },
    },
  ];

  return (
    <>
      <BetaSchemaForm<SystemAdmin>
        //title={props?.isEdit ? '编辑账号' : '新增账号'}
        title={'修改密码'}
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
          if (values.password !== values.passwordConfirm) {
            message.error('新密码和确认密码不一致，请重新输入！');
            return false; // 阻止表单提交
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
