import ProForm, {
  ProFormText,
  ProFormSelect,
  DrawerForm,
  ProFormSwitch,
} from '@ant-design/pro-form';
import { message } from 'antd';
import React from 'react';
import MyAmap from './MyAmap';

export type MergeFormProps = {
  visible?: boolean;
  isEdit?: boolean;
  onCancel?: () => void;
};

const MergeForm: React.FC<MergeFormProps> = (props) => {
  return (
    <>
      <DrawerForm
        title={props?.isEdit ? '编辑楼宇' : '新建楼宇'}
        autoFocusFirstInput
        layout="horizontal"
        visible={props?.visible}
        onVisibleChange={(show: boolean) => {
          if (!show) props?.onCancel?.();
        }}
        drawerProps={{
          destroyOnClose: true,
          onClose: () => {
            props?.onCancel?.();
          },
        }}
        onFinish={async (values) => {
          // await waitTime(2000);
          console.log(values);
          message.success('提交成功');
          return true;
        }}
      >
        <ProForm.Item>
          <MyAmap />
        </ProForm.Item>
        <ProForm.Group>
          <ProFormText width="sm" name="areaName" label="楼宇名称" placeholder="请输入名称" />
          <ProFormSelect
            width="sm"
            options={[
              {
                value: 'time',
                label: '履行完终止',
              },
            ]}
            name="kitchenId"
            label="所属厨房"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText width="xs" name="province" label="省" placeholder="请输入名称" />
          <ProFormText width="xs" name="city" label="市" placeholder="请输入名称" />
          <ProFormText width="xs" name="district" label="区" placeholder="请输入名称" />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText width="sm" name="latitude" label="经度" placeholder="请输入名称" />
          <ProFormText width="sm" name="longitude" label="维度" placeholder="请输入名称" />
        </ProForm.Group>

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
          />
          <ProFormText width="sm" name="pickUpAddress" label="自提点" placeholder="请输入名称" />
        </ProForm.Group>
        <ProFormSwitch
          label="状态"
          name="status"
          width="sm"
          // fieldProps={{
          //   onChange: (v) => setLimitBuyState(v),
          // }}
        />
        {/* <ProForm.Item name="status" label='状态'>
          <Switch defaultChecked={false} />
        </ProForm.Item> */}
      </DrawerForm>
    </>
  );
};

export default MergeForm;
