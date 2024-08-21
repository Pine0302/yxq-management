import React, { useRef, useEffect } from 'react';
import { Modal, Card } from 'antd';
import type { FormInstance } from '@ant-design/pro-form';
import type { SystemAdmin, SystemAdminItem } from '../data.d';
import '../style.less';
type ShowFormProps = {
  visible?: boolean;
  onCancel?: () => void;
  isEdit?: boolean;
  viewMode?: boolean; // 用于查看模式
  value?: SystemAdmin;
  onSuccess?: () => void;
};

const ShowForm: React.FC<ShowFormProps> = (props) => {
  const formRef = useRef<FormInstance<SystemAdminItem>>();

  useEffect(() => {
    if (props?.value) {
      console.log(props.value);
      formRef.current?.setFieldsValue(props.value);
    } else {
      formRef.current?.resetFields();
    }
  }, [props.value]);

  return (
    <Modal
      title="查看详细信息"
      visible={props.visible}
      onCancel={props.onCancel}
      footer={null}
      destroyOnClose
      width={1000} // 可以调整宽度
    >
      <div className="text-title text-bg">基础信息</div>
      <Card style={{ width: '100%' }}>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">姓名:</span>
            <span className="info-value">{props.value?.realName}</span>
          </div>
          <div className="info-item">
            <span className="info-label">状态:</span>
            <span className="info-value">{props.value?.status}</span>
          </div>
          <div className="info-item">
            <span className="info-label">登录账号:</span>
            <span className="info-value">{props.value?.account}</span>
          </div>
          <div className="info-item">
            <span className="info-label">昵称:</span>
            <span className="info-value">{props.value?.nickName}</span>
          </div>
          <div className="info-item">
            <span className="info-label">手机号:</span>
            <span className="info-value">{props.value?.phone}</span>
          </div>
          <div className="info-item">
            <span className="info-label">所属公司:</span>
            <span className="info-value">{props.value?.company}</span>
          </div>
          <div className="info-item">
            <span className="info-label">职务:</span>
            <span className="info-value">{props.value?.position}</span>
          </div>
          <div className="info-item">
            <span className="info-label">部门:</span>
            <span className="info-value">{props.value?.dept}</span>
          </div>
          <div className="info-item">
            <span className="info-label">最近登录时间:</span>
            <span className="info-value">{props.value?.pwdResetTime}</span>
          </div>
          <div className="info-item">
            <span className="info-label">最近登录ip:</span>
            <span className="info-value">{props.value?.lastIp}</span>
          </div>
          {/* 其他信息 */}
        </div>
      </Card>
      <div className="text-title text-bg">拥有的角色</div>
      <Card>
        <div className="info-item">
          <span className="info-label">账号角色:</span>
          <div className="roles-container">
            {props.value?.systemRoles && props.value.systemRoles.length > 0 ? (
              props.value.systemRoles.map((role, index) => (
                <div key={index} className="role-badge">
                  {role.name}
                </div>
              ))
            ) : (
              <div className="info-item">没有配置角色</div>
            )}
          </div>
        </div>
      </Card>
    </Modal>
  );
};

export default ShowForm;
