import { CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, message, Modal, Switch } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { kitchenLivePageInfo, deleteKitchenLive, updateKitchenLiveStatus } from './service';
import type { KitchenLiveTableItem, TableListPagination } from './data';
import MergeForm from './components/MergeForm';
import { kitchenPageInfo } from '../../biz/KitchenManage/service';
import type { RequestOptionsType } from '@ant-design/pro-utils';
import * as styles from './style.less';

const tableRequest = async (params?: { pageSize: number; current: number }) => {
  const res = await kitchenLivePageInfo({
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

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [mergeFormVisible, setMergeFormVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<any>();
  /** 国际化配置 */

  // 使用POST方法删除数据的函数
  const handleDelete = (record) => {
    Modal.confirm({
      title: '确定删除这条记录吗？',
      content: '删除后无法恢复，请确认！',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          const res = await deleteKitchenLive(record);
          message.success('删除成功');
          actionRef.current?.reload(); // 刷新表格数据
        } catch (error) {
          message.error('删除操作失败: ' + error.message);
        }
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

  const columns: ProColumns<KitchenLiveTableItem>[] = [
    {
      title: '厨房名称',
      dataIndex: 'kitchenName',
      hideInSearch: true,
    },
    {
      title: '直播间名称',
      dataIndex: 'liveName',
      hideInSearch: true,
    },
    {
      title: '厨房',
      dataIndex: 'kitchenId',
      valueType: 'select',
      hideInTable: true,
      request: kitchenSelectRequest,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select', // 指定为下拉选择框
      valueEnum: {
        1: { text: '开启', status: 'Processing' },
        0: { text: '关闭', status: 'Default' },
      },
      render: (_, record) => (
        <Switch
          checkedChildren="开启"
          unCheckedChildren="关闭"
          checked={record.status === 1}
          onChange={(checked) => handleStatusChange(record, checked)}
        />
      ),
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            setMergeFormVisible(true);
            setIsEdit(true);
            setCurrentRow(record);
            console.log(record);
          }}
        >
          编辑
        </a>,
        <a key="delete" onClick={() => handleDelete(record)}>
          删除
        </a>,
      ],
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
        onSuccess={() => actionRef.current?.reload()}
      />
    </PageContainer>
  );
};

export default TableList;
