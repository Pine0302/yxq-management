import React, { useState, useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import request from 'umi-request';
import MergeForm from './components/MergeForm';
import { Button } from 'antd';
import type { ActionType } from '@ant-design/pro-table';

const fetchTableData = async (params, sorter, filter) => {
  try {
    // 提取搜索关键字并准备请求体
    const query = {
      ...params,
      // 确保传递给后端的是正确的查询字段
      title: params.title,
    };

    const res = await request('/adminapi/system/menu/list', {
      method: 'GET', // 使用POST方法
      params: query, // 传递查询参数
    });

    if (res.code === 200 && res.success) {
      return {
        data: res.data,
        success: true,
      };
    } else {
      throw new Error(res.msg || 'Data fetch error');
    }
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return {
      data: [],
      success: false,
    };
  }
};

const TreeTable = () => {
  // 定义状态变量
  const [mergeFormVisible, setMergeFormVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const actionRef = useRef<ActionType>();

  const columns = [
    {
      title: '名称',
      dataIndex: 'title',
      key: 'title',
      // 在列定义中添加搜索配置
      search: {
        transform: (value) => ({ title: value }),
      },
    },
    {
      title: '所属应用',
      dataIndex: 'application',
      key: 'application',
      valueType: 'text',
      search: false, // 禁用此列的搜索功能
    },
    {
      title: '图标地址',
      dataIndex: 'icon',
      key: 'icon',
      valueType: 'text',
      search: false, // 禁用此列的搜索功能
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      valueType: 'text',
      search: false, // 禁用此列的搜索功能
      // 使用 valueEnum 来转换数值为描述文本
      valueEnum: {
        1: { text: '目录' },
        2: { text: '菜单' },
        3: { text: '按钮' },
      },
    },
    {
      title: '排序号',
      dataIndex: 'menuSort',
      key: 'menuSort',
      valueType: 'text',
      search: false, // 禁用此列的搜索功能
    },
    {
      title: '可见性',
      dataIndex: 'hidden',
      key: 'hidden',
      valueType: 'text',
      search: false, // 禁用此列的搜索功能
      // 使用 valueEnum 来转换数值为描述文本
      valueEnum: {
        true: { text: '不可见' },
        false: { text: '可见' },
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      valueType: 'text',
      search: false, // 禁用此列的搜索功能
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
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
          <a key="delete" onClick={() => handleDelete(record)}>
            删除
          </a>,

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
    <>
      <ProTable
        columns={columns}
        request={fetchTableData}
        rowKey="menuId"
        pagination={false}
        expandable={{
          defaultExpandAllRows: true, // 确保所有行默认展开
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setMergeFormVisible(true);
              setIsEdit(false);
              setCurrentRow(undefined);
              setViewMode(false);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
      />
      <MergeForm
        visible={mergeFormVisible}
        onCancel={() => setMergeFormVisible(false)}
        value={currentRow}
        isEdit={isEdit}
        viewMode={viewMode} // 传递 viewMode 状态
        onSuccess={() => actionRef.current?.reload()}
      />
    </>
  );
};

export default TreeTable;
