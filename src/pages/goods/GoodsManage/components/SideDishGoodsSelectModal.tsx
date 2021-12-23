import React from 'react';
import { Button, message } from 'antd';
import ProForm, { ModalForm, ProFormSelect } from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import SideDishSearchInput from './SideDishSearchInput';

const SideDishGoodsSelectModal: React.FC<any> = (props) => {
  return (
    <ModalForm
      title="选择配菜"
      layout="horizontal"
      trigger={
        <Button type="primary">
          <PlusOutlined />
          添加配菜
        </Button>
      }
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}
      onFinish={async (values) => {
        console.log(values);
        message.success('提交成功');

        const fn = async () => {
          props?.onFinish?.(values);
          return Promise.resolve();
        }

        // await props?.onFinish?.(values);
        await fn();

        return true;
      }}
    >
      <ProForm.Group>
        <ProForm.Item name="sideDishGoods" label="选择配菜" rules={[{ required: true }]}>
          <SideDishSearchInput />
        </ProForm.Item>
        <ProForm.Item name="type" label="类型" rules={[{ required: true }]}>
          <ProFormSelect
            options={[
              {
                value: 'MAST_CHOICE',
                label: '必选',
              },
              {
                value: 'SIDE_DISH',
                label: '小菜',
              },
              {
                value: 'SOUP',
                label: '例汤',
              },
            ]}
          />
        </ProForm.Item>
      </ProForm.Group>
    </ModalForm>
  );
};

export default SideDishGoodsSelectModal;
