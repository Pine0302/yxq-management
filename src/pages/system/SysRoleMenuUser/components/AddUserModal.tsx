import React, { useState, useEffect } from 'react';
import { Modal, Transfer, Button, message } from 'antd';
import { getSysRoleUserMenuInfo, updateUser } from '../service';

interface AddUserModalProps {
  isVisible: boolean;
  onClose: () => void;
  data: any; // 包含 allUsers 和 systemUsers
  fetchUserData: () => void; // 刷新用户数据的方法
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isVisible, onClose, data, fetchUserData }) => {
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [immutableKeys, setImmutableKeys] = useState<string[]>([]);

  useEffect(() => {
    if (data) {
      console.log('data:', data);
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
    avatar:
      user.avatar_path || 'http://img.nidcai.com//2021/12/18/7bf8bd2a750b0f14420a3004c0adc236.png', // 假设用户数据中有 avatar 字段或提供一个默认头像
    disabled: immutableKeys.includes(user.id.toString()), // 只有原始不可移动的用户被禁用
  }));

  // key: user.id.toString(),
  // title: user.account,
  // description: user.phone,
  // // 如果用户已经在右边（targetKeys 中），则设置为 disabled 状态
  // disabled: targetKeys.includes(user.id.toString()),
  // }));

  const handleSubmit = async () => {
    console.log('Selected users:', targetKeys);
    try {
      const response = await updateUser({ roleId: data.roleId, targetKeys });
      if (response.code === 200 && response.success) {
        console.log('Response:', response);
        message.success('用户更新成功！');
        fetchUserData(); // 调用传入的方法更新列表页数据
      } else {
        console.log('Response:', response);
        message.error('用户更新失败！'); // 这里应使用 message.error
      }
    } catch (error) {
      console.error('Update Error:', error);
      message.error('更新过程中发生错误！');
    }
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
        render={(item) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={item.avatar}
              alt="avatar"
              style={{ width: 30, height: 30, marginRight: 8, borderRadius: '50%' }}
            />
            {item.title || '未知用户'}
          </div>
        )}
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
