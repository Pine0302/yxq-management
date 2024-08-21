import React, { useState, useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import request from 'umi-request';
import MergeForm from './components/MergeForm';
import { Button, Modal, message } from 'antd';
import type { ActionType } from '@ant-design/pro-table';
import { deleteMenu } from './service';
import { PageContainer } from '@ant-design/pro-layout';

const removeNode = (nodes, id) => {
  return nodes
    .map((node) => {
      // 如果找到匹配的节点，不将其添加到新数组中
      if (node.menuId === id) {
        return null;
      }
      // 如果当前节点有子节点，递归处理子节点
      if (node.children && node.children.length > 0) {
        return { ...node, children: removeNode(node.children, id) };
      }
      // 如果当前节点不是要删除的节点，并且没有子节点或子节点不包含要删除的节点
      return node;
    })
    .filter((node) => node !== null); // 移除掉被标记为 null 的节点
};

const TreeTable = () => {
  // 定义状态变量
  const [mergeFormVisible, setMergeFormVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const actionRef = useRef<ActionType>();
  const [tableData, setTableData] = useState([]); // 存储表格数据

  const [queryParams, setQueryParams] = useState({}); // 用于存储查询参数
  const [querySorter, setQuerySorter] = useState({});
  const [queryFilter, setQueryFilter] = useState({});

  const [parentID, setParentID] = useState(null); // 添加状态用于存储父级ID

  // 修改添加子级按钮事件
  const handleAddSub = (record) => {
    setParentID(record.menuId); // 设置父级ID
    setCurrentRow(null); // 清除当前行，因为是新建
    setIsEdit(false);
    setViewMode(false);
    setMergeFormVisible(true);
  };

  const fetchTableData = async (
    params = queryParams,
    sorter = querySorter,
    filter = queryFilter,
  ) => {
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
        console.log('res.data');
        console.table(res.data);
        setTableData(res.data); // 更新状态中的表格数据
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

  const handleDelete = async (record) => {
    let mess = '删除后不可恢复，确定删除“' + record.title + '”？';

    Modal.confirm({
      title: '确定删除这条记录吗？',
      content: mess,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        const res = await deleteMenu(record);
        console.log(res);
        message.success('删除成功');
        // 从表格数据中移除已删除的项
        const newData = removeNode(tableData, record.menuId);
        console.table(newData);
        console.table(record);
        setTableData(newData); // 更新表格数据

        actionRef.current?.reload(); // 刷新表格数据
      },
    });
  };

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
              setParentID(null); // 设置父级ID
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
          <a key="addSub" onClick={() => handleAddSub(record)}>
            添加子级
          </a>,
          <a key="delete" onClick={() => handleDelete(record)}>
            删除
          </a>,
        ];
      },
    },
  ];

  // ProTable 的请求方法需要保存最新的查询参数
  const handleTableChange = (pagination, filters, sorter, extra) => {
    setQueryParams(extra.currentDataSource);
    setQuerySorter(sorter);
    setQueryFilter(filters);
  };
  return (
    <PageContainer>
      <ProTable
        columns={columns}
        request={fetchTableData}
        dataSource={tableData} // 使用 dataSource 属性绑定数据
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
              setCurrentRow(null);
              setViewMode(false);
              setParentID(null); // 设置父级ID
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
        parentID={parentID} // 传递父级ID
        onSuccess={() => {
          // 可以在这里重新调用 fetchTableData 来刷新数据
          fetchTableData(queryParams, querySorter, queryFilter);
          console.log('qwertyu');
        }}
      />
    </PageContainer>
  );
};

export default TreeTable;
