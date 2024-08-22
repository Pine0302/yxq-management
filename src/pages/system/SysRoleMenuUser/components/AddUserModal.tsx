import React, { useState, useEffect } from 'react';
import { Modal, Transfer, Button, message } from 'antd';

interface AddUserModalProps {
  isVisible: boolean;
  onClose: () => void;
  data: any; // 包含 allUsers 和 systemUsers
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isVisible, onClose, data }) => {
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [immutableKeys, setImmutableKeys] = useState<string[]>([]);

  useEffect(() => {
    if (data) {
      console.log('data:', data.systemUsers);
      const selectedKeys = data.systemUsers.map((user: any) => user.id.toString());
      const initialImmutableKeys = data.systemUsers.map((user: any) => user.id.toString());
      setTargetKeys(selectedKeys);
      setImmutableKeys(initialImmutableKeys);
      console.log('initialImmutableKeys:', initialImmutableKeys);
    }
  }, [data]);

  const handleChange = (nextTargetKeys: string[], direction: string, moveKeys: string[]) => {
    if (direction === 'left') {
      // 只移除非不可移动的用户
      const movableKeys = moveKeys.filter((key) => !immutableKeys.includes(key));
      setTargetKeys((prevKeys) => prevKeys.filter((key) => !movableKeys.includes(key)));
    } else {
      setTargetKeys((prevKeys) => [...prevKeys, ...moveKeys]);
    }
  };

  const dataSource = data?.allUsers?.map((user: any) => ({
    key: user.id.toString(),
    title: user.account,
    description: user.phone,
    disabled: immutableKeys.includes(user.id.toString()), // 只有原始不可移动的用户被禁用
  }));

  const handleSubmit = () => {
    console.log('Selected users:', targetKeys);
    message.success('用户更新成功！');
    onClose();
  };

  return (
    <Modal
      title="新增用户"
      visible={isVisible}
      onCancel={onClose}
      onOk={handleSubmit}
      destroyOnClose
    >
      <Transfer
        dataSource={dataSource}
        titles={['所有用户', '已选用户']}
        targetKeys={targetKeys}
        onChange={handleChange}
        render={(item) => item.title || '未知用户'}
        listStyle={{
          width: 250,
          height: 300,
        }}
        showSearch
        filterOption={(inputValue, item) =>
          item.title.toLowerCase().includes(inputValue.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(inputValue.toLowerCase()))
        }
      />
    </Modal>
  );
};

export default AddUserModal;
