import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Modal, Switch } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  sysAdminPageInfo,
  deleteSystemUser,
  updateSystemUserStatus,
  getRoleUserNum,
} from './service';
import type {
  KitchenLiveTableItem,
  TableListPagination,
  SystemAdminTableWrapper,
  SystemAdminItem,
} from './data';
import MergeForm from './components/MergeForm';
import ChangePwdForm from './components/ChangePwdForm';
import ShowForm from './components/ShowForm';
import { kitchenPageInfo } from '../../biz/KitchenManage/service';
import type { RequestOptionsType } from '@ant-design/pro-utils';
import { useHistory } from 'react-router-dom'; // 引入 useHistory 钩子

const tableRequest = async (params?: { pageSize: number; current: number }) => {
  const res = await sysAdminPageInfo({
    ...params,
    pageNum: params?.current,
  });

  return { data: res.data?.list, success: true, total: res.data?.total };
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

const handleSubmit = async (values: any, isEdit: boolean = false) => {
  if (!isEdit) {
    console.log(values);
    return await addKitchenLive(values);
  } else {
    return await updateKitchenLive(values);
  }
};

const handleStatusChange = async (record, enable) => {
  const status = enable ? 1 : 0; // 状态设置为1启用，0禁用
  const id = record.id;
  try {
    const res = await updateSystemUserStatus({ id, status });
    if (res.success) {
      message.success(`${enable ? '启用' : '禁用'}成功`);
      actionRef.current?.reload(); // 刷新表格数据
    } else {
      throw new Error(res.message);
    }
  } catch (error) {
    message.error(`${enable ? '启用' : '禁用'}失败: ` + error.message);
    actionRef.current?.reload();
  }
};

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [mergeFormVisible, setMergeFormVisible] = useState<boolean>(false);
  const [changePwdFormVisible, setChangePwdFormVisible] = useState<boolean>(false);
  const [showFormVisible, setShowFormVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState(false); // 新增 viewMode 状态
  const [currentRow, setCurrentRow] = useState<any>();
  /** 国际化配置 */

  // 使用POST方法删除数据的函数
  const handleDelete = async (record) => {
    const mess = '删除后不可恢复，确定删除账号“' + record.account + '”？';

    Modal.confirm({
      title: '确定删除这条记录吗？',
      content: mess,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        const res = await deleteSystemUser(record);
        console.log(res);
        message.success('删除成功');
        actionRef.current?.reload(); // 刷新表格数据
      },
    });
  };

  const handleStatusChange = async (record, checked) => {
    const status = checked ? 1 : 0; // 假设1代表开启，0代表关闭
    const id = record.id;
    try {
      const res = await updateSystemUserStatus({ id, status });
      if (res.success) {
        message.success('状态更新成功');
        actionRef.current?.reload(); // 刷新表格数据
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      message.error('状态更新失败: ' + error.message);
      // 还原开关状态
      actionRef.current?.reload();
    }
  };

  const columns: ProColumns<SystemAdminItem>[] = [
    {
      title: '姓名',
      dataIndex: 'realName',
    },
    {
      title: '账号',
      dataIndex: 'account',
      hideInSearch: true,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      hideInSearch: true,
    },
    {
      title: '所属公司',
      dataIndex: 'company',
      hideInSearch: true,
    },
    {
      title: '部门',
      dataIndex: 'dept',
      hideInSearch: true,
    },
    {
      title: '职务',
      dataIndex: 'position',
      hideInSearch: true,
    },
    {
      title: '角色',
      dataIndex: 'systemRoles', // 这里可以指定为systemRoles，尽管在render中会直接使用record
      render: (_, record) => {
        // 如果存在角色数据，将每个角色的名称用逗号连接起来展示
        return record.systemRoles && record.systemRoles.length > 0
          ? record.systemRoles.map((role) => role.name).join(', ')
          : '无角色'; // 如果没有角色数据，展示"无角色"
      },
      hideInSearch: true, // 如果不需要在搜索栏中搜索此列，可以设置为true
    },
    /*{
      title: '角色1',
      dataIndex: 'systemRoles',
      render: (_, record) => {
        const history = useHistory(); // 使用 useHistory 钩子获取历史对象

        // 角色名称点击事件处理函数
        const handleRoleClick = (roleName) => {
          // 跳转到角色页面，并通过URL参数传递角色名称
          history.push(`/system/sys-role?search=${encodeURIComponent(roleName)}`);
        };

        return record.systemRoles && record.systemRoles.length > 0
          ? record.systemRoles.map((role) => (
              <a
                key={role.roleId}
                onClick={() => handleRoleClick(role.name)}
                style={{ marginRight: 8 }}
              >
                {role.name}
              </a>
            ))
          : '无角色';
      },
      hideInSearch: true,
    },*/
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      valueType: 'text',
      search: false, // 禁用此列的搜索功能
      // 使用 valueEnum 来转换数值为描述文本
      valueEnum: {
        OK: { text: '启用' },
        DISABLED: { text: '禁用' },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        // 判断是否是超级管理员
        const isSuperAdmin = record.isAdmin === true;

        // 根据 isSuperAdmin 变量决定是否显示编辑和删除按钮
        return [
          <a
            key="edit"
            onClick={() => {
              setMergeFormVisible(true);
              setIsEdit(true);
              setViewMode(false); // 取消设置为查看模式
              setCurrentRow(record);
              console.log(record);
            }}
          >
            编辑
          </a>,
          !isSuperAdmin && (
            <a key="delete" onClick={() => handleDelete(record)}>
              删除
            </a>
          ),
          !isSuperAdmin && (
            <a
              key="changePwd"
              onClick={() => {
                setChangePwdFormVisible(true);
                setIsEdit(true);
                setViewMode(false); // 取消设置为查看模式
                setCurrentRow(record);
                console.log(record);
              }}
            >
              修改密码
            </a>
          ),

          <a
            key="view"
            onClick={() => {
              setShowFormVisible(true);
              setIsEdit(false);
              setViewMode(true); // 设置为查看模式
              setCurrentRow(record);
              console.log(record);
            }}
          >
            查看
          </a>,
          !isSuperAdmin && (
            <a
              key="toggleStatus"
              onClick={() => {
                const isEnabling = record.statusInt === 0;
                Modal.confirm({
                  title: `确定${isEnabling ? '启用' : '禁用'}该用户吗？`,
                  content: isEnabling
                    ? '启用后，该人员将恢复正常使用，确定继续启用？'
                    : '禁用后，该账号无法登录和使用相关权限的功能，确定继续禁用？',
                  okText: '确认',
                  cancelText: '取消',
                  onOk: () => handleStatusChange(record, isEnabling),
                });
              }}
            >
              {record.statusInt === 0 ? '启用' : '禁用'}
            </a>
          ),
        ];
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<KitchenLiveTableItem, TableListPagination>
        // headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setMergeFormVisible(true);
              setIsEdit(false);
              setCurrentRow(undefined);
              setViewMode(false); // 确保新建模式下不是查看模式
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={tableRequest}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            console.log(selectedRows);
            // setSelectedRows(selectedRows);
          },
        }}
      />

      <MergeForm
        visible={mergeFormVisible}
        onCancel={() => setMergeFormVisible(false)}
        value={currentRow}
        isEdit={isEdit}
        viewMode={viewMode} // 传递 viewMode 状态
        onSuccess={() => actionRef.current?.reload()}
      />

      <ChangePwdForm
        visible={changePwdFormVisible}
        onCancel={() => setChangePwdFormVisible(false)}
        value={currentRow}
        isEdit={isEdit}
        viewMode={viewMode} // 传递 viewMode 状态
        onSuccess={() => actionRef.current?.reload()}
      />
      <ShowForm
        visible={showFormVisible}
        onCancel={() => setShowFormVisible(false)}
        value={currentRow}
        isEdit={false}
        viewMode={viewMode}
        onSuccess={() => actionRef.current?.reload()}
      />
    </PageContainer>
  );
};

export default TableList;
