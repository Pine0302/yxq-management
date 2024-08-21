import { PlusOutlined, SettingFilled } from '@ant-design/icons';
import { Button, message, Modal, Switch, FormInstance } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable, { ProTableProps } from '@ant-design/pro-table';
import { sysRolePageInfo, deleteRole, updateKitchenLiveStatus, getRoleUserNum } from './service';
import type { KitchenLiveTableItem, TableListPagination } from './data';
import MergeForm from './components/MergeForm';
import { kitchenPageInfo } from '../../biz/KitchenManage/service';
import type { RequestOptionsType } from '@ant-design/pro-utils';
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom'; // 导入 useHistory 进行导航

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

interface TableRequestParams {
  current?: number;
  pageSize?: number;
  pageNum?: number;
  name?: string; // 添加搜索字段
}

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const [mergeFormVisible, setMergeFormVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState(false); // 新增 viewMode 状态
  const [currentRow, setCurrentRow] = useState<any>();
  const history = useHistory(); // 使用 useHistory 钩子

  const location = useLocation();
  const initialName = new URLSearchParams(location.search).get('search') ?? '';

  /** 国际化配置 */

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const name = query.get('search');
    if (name) {
      console.log('name', name);
      const decodedName = decodeURIComponent(name);
      // 直接在这里设置 ProTable 表单的初始值
      formRef.current?.setFieldsValue({ name: decodedName });
    }
  }, [location]);

  const tableRequest = async (params?: TableRequestParams) => {
    // 在请求前打印看看传入的参数
    console.log('即将发送的请求参数：', params);
    if (formRef.current?.getFieldsValue().name) {
      params.name = formRef.current?.getFieldsValue().name;
    }
    const res = await sysRolePageInfo({
      ...params,
      pageNum: params?.current,
    });

    return { data: res.data?.list, success: true, total: res.data?.total };
  };

  // 使用POST方法删除数据的函数
  const handleDelete = async (record) => {
    let mess = '删除后不可恢复，确定删除“' + record.name + '”角色？';

    const result = await getRoleUserNum({ roleId: record.roleId });
    console.log('result');
    console.table(result.data);
    // 如果需要根据 result.data 进行后续处理，请在这里进行判断
    if (result.data != null && result.data.length > 0) {
      let size = result.data.length;
      mess =
        '角色已被使用，若强制删除，会将该角色跟系统账号（已授权' +
        size +
        '个）的关联关系，角色跟权限的关联关系一并清除，确定继续删除？';
    }
    Modal.confirm({
      title: '确定删除这条记录吗？',
      content: mess,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        const res = await deleteRole(record);
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
      const res = await updateKitchenLiveStatus({ id, status });
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

  const handlePermissionClick = (id: number) => {
    // 实现跳转逻辑，假设目标页面的路径为 '/permissions'
    history.push(`/system/sys-role-menu-user?id=${id}`);
  };

  const columns: ProColumns<KitchenLiveTableItem>[] = [
    {
      title: '角色',
      dataIndex: 'name',
    },
    {
      title: '类型',
      dataIndex: 'typeName',
      hideInSearch: true,
    },
    {
      title: '描述',
      dataIndex: 'description',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      hideInSearch: true,
    },
    {
      title: '权限',
      dataIndex: 'createTime',
      hideInSearch: true,
      render: (_, record) => (
        <SettingFilled
          onClick={() => handlePermissionClick(record.roleId)}
          style={{ cursor: 'pointer', color: 'blue' }}
        />
      ),
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        // 判断是否是超级管理员
        const isSuperAdmin = record.roleId === 1;

        // 根据 isSuperAdmin 变量决定是否显示编辑和删除按钮
        return [
          !isSuperAdmin && (
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
            </a>
          ),
          !isSuperAdmin && (
            <a key="delete" onClick={() => handleDelete(record)}>
              删除
            </a>
          ),
          <a
            key="view"
            onClick={() => {
              setMergeFormVisible(true);
              setIsEdit(false);
              setViewMode(true); // 设置为查看模式
              setCurrentRow(record);
              console.log(record);
            }}
          >
            查看
          </a>,
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
        formRef={formRef}
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
        request={(params, sorter, filter) => {
          // 输出看看表单当前的值
          console.log(params.name); // 输出搜索参数值
          return tableRequest(params);
        }}
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
    </PageContainer>
  );
};

export default TableList;
