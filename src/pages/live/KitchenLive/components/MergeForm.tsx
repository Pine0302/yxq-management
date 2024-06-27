import React, { useEffect, useRef } from 'react';
import type { FormInstance, ProFormColumnsType } from '@ant-design/pro-form';
import { BetaSchemaForm } from '@ant-design/pro-form';
import { message } from 'antd';
import type { RequestOptionsType } from '@ant-design/pro-utils';
import { kitchenPageInfo } from '../../../biz/KitchenManage/service';
import { addKitchenLive, updateKitchenLive } from '../service';

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
    console.log(values);
    return await addKitchenLive(values);
  } else {
    return await updateKitchenLive(values);
  }
};

const kitchenSelectRequest = async () => {
  const res = await kitchenPageInfo({ current: 1, pageNum: 1, pageSize: 1000 });
  const zh = (res?.data?.list || []).map((v) => {
    return {
      label: v.name,
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
    title: '直播间名称',
    dataIndex: 'liveName',
    formItemProps: {
      rules: [{ required: true }],
    },
  },
  {
    title: '排序',
    dataIndex: 'sort',
    formItemProps: {
      rules: [{ required: true }],
    },
  },
  {
    title: '所在厨房',
    dataIndex: 'kitchenId',
    valueType: 'select',
    width: '100%',
    request: kitchenSelectRequest,
    formItemProps: {
      rules: [{ required: true }],
    },
  },
  // {
  //   title: '是否管理',
  //   dataIndex: 'isAdmin',
  //   valueType: 'radioButton',
  //   request: async () => {
  //     return [
  //       { label: '是', value: 1 },
  //       { label: '否', value: 0 },
  //     ] as RequestOptionsType[];
  //   },
  //   formItemProps: {
  //     rules: [{ required: true }],
  //   },
  // },
  // {
  //   title: '状态',
  //   dataIndex: 'status',
  //   valueType: 'radioButton',
  //   request: async () => {
  //     return [
  //       { label: '正常', value: 1 },
  //       { label: '禁用', value: 0 },
  //     ] as RequestOptionsType[];
  //   },
  //   formItemProps: {
  //     rules: [{ required: true }],
  //   },
  // },
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
        title={props?.isEdit ? '编辑厨房直播摄像头' : '新增厨房直播摄像头'}
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
