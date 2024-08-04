import React, { useEffect, useRef, useState } from 'react';
import type { FormInstance, ProFormColumnsType } from '@ant-design/pro-form';
import { BetaSchemaForm } from '@ant-design/pro-form';
import { message, Radio, Input } from 'antd';
import { addSystemRole, updateSystemRole } from '../service';
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

type DataItem = {
  id: number;
  name: string;
  phone: string;
  isAdmin: boolean;
  areaId: number;
};

const handleSubmit = async (values: any, isEdit: boolean = false) => {
  console.log('values', values);
  console.log('isEdit', isEdit);
  if (!isEdit) {
    return await addSystemRole(values);
  } else {
    return await updateSystemRole(values);
  }
};

const MergeForm: React.FC<MergeFormProps> = (props) => {
  const formRef = useRef<FormInstance<DataItem>>();
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

  const columns: ProFormColumnsType<DataItem>[] = [
    {
      title: 'id',
      dataIndex: 'roleId',
      formItemProps: {
        hidden: true,
      },
    },
    {
      title: '角色名称',
      dataIndex: 'name',
      renderFormItem: (item, { defaultRender }) => {
        return <Input {...item} disabled={props.viewMode} placeholder="请输入角色名称" />;
      },
      formItemProps: {
        rules: [{ required: true }],
      },
    },

    {
      title: '类型',
      dataIndex: 'type_name',
      renderFormItem: (_, { type, defaultRender }) => {
        if (type === 'form') {
          return (
            <Radio.Group defaultValue={1} disabled>
              <Radio value={1}>内置角色</Radio>
            </Radio.Group>
          );
        }
        return defaultRender(_);
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      renderFormItem: (item, { defaultRender }) => {
        return <Input {...item} disabled={props.viewMode} placeholder="请输入角色名称" />;
      },
      formItemProps: {
        rules: [{ required: true }],
      },
    },
  ];

  return (
    <>
      <BetaSchemaForm<DataItem>
        //title={props?.isEdit ? '编辑角色' : '新增角色'}
        title={props?.viewMode ? '查看角色' : props?.isEdit ? '编辑角色' : '新增角色'}
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
              cover: fileList.length > 0 ? fileList[0].thumbUrl || fileList[0].url : '',
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
