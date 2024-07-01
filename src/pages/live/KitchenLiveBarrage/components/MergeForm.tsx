import React, { useEffect, useRef } from 'react';
import type { FormInstance, ProFormColumnsType } from '@ant-design/pro-form';
import { BetaSchemaForm } from '@ant-design/pro-form';
import { message } from 'antd';
import { buildingPageInfo } from '../../../biz/BuildingManage/service';
import type { RequestOptionsType } from '@ant-design/pro-utils';
import { addDeliveryUser, updateDeliveryUser } from '../service';

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
  code: string;
  areaId: number;
};

const handleSubmit = async (values: any, isEdit: boolean = false) => {
  if (!isEdit) {
    return await addDeliveryUser(values);
  } else {
    return await updateDeliveryUser(values);
  }
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
      rules: [{ required: true }],
    },
  },
  {
    title: '电话',
    dataIndex: 'phone',
    formItemProps: {
      rules: [{ required: true }],
    },
  },
  {
    title: '身份证',
    dataIndex: 'code',
    formItemProps: {
      rules: [{ required: true }],
    },
  },
  {
    title: '工作楼宇',
    dataIndex: 'areaId',
    valueType: 'select',
    request: buildingSelectRequest,
    width: '100%',
    formItemProps: {
      rules: [{ required: true }],
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
        title={props?.isEdit ? '编辑配送员' : '新增配送员'}
        formRef={formRef}
        width={500}
        layout="horizontal"
        layoutType="ModalForm"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 22 }}
        onFinish={async (values) => {
          console.log(values);
          await handleSubmit(values, props?.isEdit);
          message.success('操作成功');
          props?.onSuccess?.();
          return true;
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
