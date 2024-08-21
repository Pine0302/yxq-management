import React, { useState, useRef, useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';

interface AddUserModalProps {
  isVisible: boolean;
  onClose: () => void;
  data: any; // 增加一个data属性来接收外部传入的数据
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isVisible, onClose, data }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    console.log('Received values of form: ', values);
    console.log('Data from parent component: ', data);
    // 在这里可以使用data数据来辅助完成表单提交等操作
    message.success('用户添加成功！');
    onClose(); // 关闭模态框
    form.resetFields(); // 重置表单字段
  };

  useEffect(() => {
    if (data) {
      console.log('Data from parent component: ', data);
    }
  }, [data, form]);

  return (
    <Modal
      title="新增用户"
      visible={isVisible}
      onCancel={onClose}
      onOk={() => form.submit()}
      destroyOnClose
    >
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item
          name="username"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="邮箱"
          rules={[{ required: true, message: '请输入邮箱地址!', type: 'email' }]}
        >
          <Input />
        </Form.Item>
        {/* 你可以在这里添加更多表单项，根据data中的信息预填或调整 */}
      </Form>
    </Modal>
  );
};

export default AddUserModal;
