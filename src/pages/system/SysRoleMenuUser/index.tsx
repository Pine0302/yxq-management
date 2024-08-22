import { PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { Layout, Tabs, Modal, Avatar, Tag, Row, Col, message, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons'; // 引入回退图标
import { PageContainer } from '@ant-design/pro-layout';
import { useLocation } from 'react-router-dom';
import { getSysRoleUserMenuInfo, removeRoleUser } from './service';
import AddUserModal from './components/AddUserModal'; // 确保路径正确
import './style.less';
const { Content } = Layout;

const SRMU: React.FC = () => {
  const location = useLocation();
  const [data, setData] = useState<any>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalStyle, setModalStyle] = useState({});
  const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false); // 新增用户模态框的可见状态

  const fetchUserData = async () => {
    try {
      const id = new URLSearchParams(location.search).get('id');
      if (id) {
        const response = await getSysRoleUserMenuInfo({ roleId: id });
        if (response.code === 200 && response.success) {
          console.log('Updated data:', response);
          setData(response.data); // 更新状态
          message.success('用户数据更新成功！');
        } else {
          throw new Error('数据更新失败');
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('获取数据失败');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [location]);

  const showModal = (user, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setSelectedUser(user);
    setModalStyle({
      top: rect.bottom + window.scrollY, // 屏幕顶部到元素底部的距离加上当前滚动位置
      left: rect.left + window.scrollX, // 元素左边到屏幕左边的距离加上当前滚动位置
      position: 'absolute', // 使用绝对定位
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddNewUser = () => {
    // 逻辑处理，如打开一个模态框供输入新用户信息
    console.log('Opening modal to add new user');
    // 此处可以设置一个状态来控制新增用户的模态框是否显示
    setIsAddUserModalVisible(true); // 假设你有一个状态来控制这个模态框
  };

  const onTagClose = (user, e) => {
    e.preventDefault(); // 阻止Tag关闭
    Modal.confirm({
      title: '确定移除人员？',
      content: `确定要移除 ${user.realName} 吗？`,
      onOk() {
        removeUser(user.id, data.roleId);
      },
    });
  };

  const fetchData = async (id: string) => {
    try {
      const roleId = parseInt(id, 10);
      if (!isNaN(roleId)) {
        const response = await getSysRoleUserMenuInfo({ roleId });
        if (response.code === 200 && response.success) {
          console.log('Response:', response);
          setData(response.data); // 将获取的数据保存到状态中
        } else {
          throw new Error(response.msg || 'Failed to fetch data');
        }
      } else {
        console.error('Invalid ID:', id);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const removeUser = async (userId: number, roleId: number) => {
    const response = await removeRoleUser({ roleId, userId });
    if (response.code === 200 && response.success) {
      console.log('Response:', response);
      message.success('人员已移除');
      // 更新data状态，移除这个用户
      const updatedUsers = data.systemUsers.filter((user) => user.id !== userId);
      setData((prev) => ({ ...prev, systemUsers: updatedUsers }));
    } else {
      console.log('Response:', response);
      message.error('移除人员失败');
    }
  };

  const onChange = (key: string) => {
    console.log(key);
  };

  const submitNewUser = async (formData) => {
    // 假设 formData 是从表单中收集的数据
    // 调用 API 来添加用户
    const response = await fetch('/api/add-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      message.success('新用户添加成功');
      setIsAddUserModalVisible(false); // 关闭模态框
      // 可以在这里调用 fetchData 或其他方法来刷新用户列表
    } else {
      message.error('添加失败，请重试');
    }
  };

  const handleCloseModal = () => {
    setIsAddUserModalVisible(false);
  };

  return (
    <PageContainer>
      <Layout>
        <Content className="content-divider">
          <Row align="middle" style={{ padding: '20px' }}>
            <Col span={2}>
              <Avatar style={{ backgroundColor: '#f56a00' }}>ico</Avatar>
            </Col>
            <Col span={20}>
              <div>
                <h2 style={{ margin: 0 }}> {data?.name}</h2>
                <p style={{ color: 'gray' }}>描述: {data?.description}</p>
              </div>
            </Col>
            <Col span={2}>
              <Button
                shape="round"
                icon={<ArrowLeftOutlined />}
                onClick={() => window.history.back()}
              >
                回退
              </Button>
            </Col>
          </Row>
        </Content>
        <Content className="tab-content-bg">
          <Tabs
            defaultActiveKey="1"
            onChange={onChange}
            items={[
              {
                label: `人员组成`,
                key: '1',
                children: (
                  <>
                    <div className="user-info">
                      <div className="user-count">
                        人数: {data?.systemUserNumber}/{data?.totalUser}
                      </div>
                      <div className="user-members">
                        <div className="user-count">成员:</div>
                        <div className="user-display">
                          {data?.systemUsers.map((user, index) => (
                            <div key={index} className="user-item">
                              <Avatar
                                className="avatar"
                                src={
                                  user.avatarPath ||
                                  'http://img.nidcai.com//2021/12/18/7bf8bd2a750b0f14420a3004c0adc236.png'
                                }
                                size="large"
                                onClick={(e) => showModal(user, e)}
                              />
                              <span className="remove-icon" onClick={(e) => onTagClose(user, e)}>
                                ×
                              </span>
                              <div>{user.realName}</div>
                            </div>
                          ))}
                          {/* 添加新用户按钮 */}
                          <div className="add-user-item">
                            <Avatar
                              className="add-user-icon"
                              size="large"
                              icon={<PlusOutlined />}
                              onClick={handleAddNewUser}
                            />
                            <div>Add New</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ),
              },
              {
                label: `功能权限`,
                key: '2',
                children: `Content of Tab Pane 2`,
              },
            ]}
          />
        </Content>
      </Layout>

      <Modal
        title="用户详情"
        style={modalStyle}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedUser && (
          <Row>
            <Col span={8} style={{ textAlign: 'center' }}>
              <Avatar
                src={
                  selectedUser.avatarPath ||
                  'http://img.nidcai.com//2021/12/18/7bf8bd2a750b0f14420a3004c0adc236.png'
                }
                size={100} // 设置较大的头像大小
                style={{ marginBottom: 16 }}
              />
            </Col>
            <Col span={16}>
              <p>姓名: {selectedUser.realName}</p>
              <p>登录账号: {selectedUser.account}</p>
              <p>手机号: {selectedUser.phone}</p>
            </Col>
          </Row>
        )}
      </Modal>

      <AddUserModal
        isVisible={isAddUserModalVisible}
        onClose={handleCloseModal}
        data={data}
        fetchUserData={fetchUserData}
      />
    </PageContainer>
  );
};

export default SRMU;
