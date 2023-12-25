import type { ProFormInstance } from '@ant-design/pro-form';
import { ProFormRadio } from '@ant-design/pro-form';
import ProForm, { ProFormText, ProFormSelect, DrawerForm } from '@ant-design/pro-form';
import type { RequestOptionsType } from '@ant-design/pro-utils';
import { message } from 'antd';
import React, { useRef } from 'react';
import { kitchenPageInfo } from '../../KitchenManageTs/service';
import { addBuilding, editBuilding } from '../service';
import MyAmap from './MyAmap';

export type MergeFormProps = {
  value?: any;
  visible?: boolean;
  isEdit?: boolean;
  onCancel?: () => void;
  onSuccess?: () => void;
};

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const handleSubmit = async (formData: any, isEdit: boolean = false) => {
  const postData = { status: 'CLOSED', ...formData };

  if (isEdit) {
    await editBuilding(postData);
  } else {
    await addBuilding(postData);
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

const MergeForm: React.FC<MergeFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>();

  // useEffect(() => {
  //   if (props.visible && props.isEdit) {
  //     formRef.current?.setFieldsValue({ ...props.value });
  //   }
  //   console.log('useEffect');
  // }, [props.visible, props.isEdit, props.value]);

  return (
    <>
      <DrawerForm
        title={props?.isEdit ? '编辑楼宇' : '新建楼宇'}
        autoFocusFirstInput
        formRef={formRef}
        layout="horizontal"
        visible={props?.visible}
        onVisibleChange={async (show: boolean) => {
          if (!show) {
            props?.onCancel?.();
          } else {
            if (props?.isEdit) {
              console.log('show', props?.value);
              await waitTime(0);
              formRef.current?.setFieldsValue(props?.value);
            }
          }
        }}
        drawerProps={{
          destroyOnClose: true,
          onClose: () => {
            props?.onCancel?.();
          },
        }}
        onFinish={async (values) => {
          await handleSubmit(values, props?.isEdit);
          message.success('提交成功');
          props?.onSuccess?.();
          // console.log(values);
          return true;
        }}
      >
        <ProForm.Item name="xxx">
          <MyAmap
            onSelected={(res) => {
              console.log('res', res);
              formRef.current?.setFieldsValue({
                areaName: res?.name,
                latitude: res.location.lat,
                longitude: res.location.lng,
              });
            }}
          />
        </ProForm.Item>
        <ProFormText name="id" hidden />
        <ProForm.Group>
          <ProFormText
            width="sm"
            name="areaName"
            label="楼宇名称"
            placeholder="请输入名称"
            rules={[{ required: true }]}
          />
          <ProFormText
            width="sm"
            name="latitude"
            label="经度"
            placeholder="请输入名称"
            readonly
            rules={[{ required: true }]}
          />
          <ProFormText
            width="sm"
            name="longitude"
            label="维度"
            placeholder="请输入名称"
            readonly
            rules={[{ required: true }]}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            width="xs"
            name="province"
            label="省"
            placeholder="请输入名称"
            rules={[{ required: true }]}
          />
          <ProFormText
            width="xs"
            name="city"
            label="市"
            placeholder="请输入名称"
            rules={[{ required: true }]}
          />
          <ProFormText
            width="xs"
            name="district"
            label="区"
            placeholder="请输入名称"
            rules={[{ required: true }]}
          />
        </ProForm.Group>
        <ProFormText
          width="sm"
          name="source"
          label="来源"
          placeholder="请输入来源"
          rules={[{ required: true }]}
          hidden
          initialValue={2}
        />
        <ProFormSelect
          width="sm"
          request={kitchenSelectRequest}
          name="kitchenId"
          label="关联门店"
          rules={[{ required: true }]}
        />

        <ProForm.Group>
          <ProFormSelect
            width="sm"
            options={[
              {
                value: 'TO_ADDR',
                label: '送货上门',
              },
              {
                value: 'FIXED_POS',
                label: '用户自提',
              },
            ]}
            name="pickUpType"
            label="提货方式"
            rules={[{ required: true }]}
            initialValue="FIXED_POS"
            hidden
          />
          <ProForm.Group>
            <ProFormText
              width="sm"
              name="pickUpAddress"
              label="自提点"
              placeholder="请输入名称"
              initialValue="杭州市体育馆"
              hidden
            />
          </ProForm.Group>
        </ProForm.Group>
        {/* <ProFormSwitch label="状态" name="status" width="sm" /> */}
        <ProFormRadio.Group
          label="状态"
          name="status"
          width="sm"
          radioType="button"
          initialValue="CLOSED"
          options={[
            {
              label: '正常',
              value: 'OK',
            },
            {
              label: '关闭',
              value: 'CLOSED',
            },
          ]}
        />
      </DrawerForm>
    </>
  );
};

export default MergeForm;
