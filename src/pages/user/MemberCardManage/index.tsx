import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { memberCardPageInfo, deleteCoupon, endCoupon } from './service';
import type { TableListItem, TableListPagination } from './data';
import MergeCForm from './components/MergeCForm';
import LaunchForm from './components/LaunchForm';
import CouponDetailForm from './components/CouponDetailForm';

const tableRequest = async (params?: { pageSize: number; current: number }) => {
  const res = await memberCardPageInfo({
    ...params,
    pageNum: params?.current,
  });

  return { data: res.data?.list, success: true, total: res.data?.total };
};

const MemberCard: React.FC = () => {
  const [mergeFormVisible, setMergeFormVisible] = useState<boolean>(false);
  const [mergeCFormVisible, setMergeCFormVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<any>();
  const [launchFormVisible, setLaunchFormVisible] = useState<boolean>(false);
  const [couponDetailFormVisible, setCouponDetailFormVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();

  const handleEdit = (record: any) => {
    setMergeFormVisible(true);
    setIsEdit(true);
    setCurrentRow(record);
  };

  const handleCEdit = (record: any) => {
    setMergeCFormVisible(true);
    setIsEdit(true);
    setCurrentRow(record);
  };

  // 使用POST方法删除数据的函数
  const handleDelete = (record: any) => {
    Modal.confirm({
      title: '确定删除这条记录吗？',
      content: '删除后无法恢复，请确认！',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          const res = await deleteCoupon(record);
          message.success('删除成功');
          actionRef.current?.reload(); // 刷新表格数据
        } catch (error) {
          message.error('删除操作失败: ' + error.message);
        }
      },
    });
  };

  // 使用POST方法删除数据的函数
  const handleEnd = (record: any) => {
    Modal.confirm({
      title: '确定要结束这个优惠券马',
      content: '结束后无法生效，请确认！',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          const res = await endCoupon(record);
          message.success('删除成功');
          actionRef.current?.reload(); // 刷新表格数据
        } catch (error) {
          message.error('删除操作失败: ' + error.message);
        }
      },
    });
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '会员卡名称',
      dataIndex: 'name',
    },
    {
      title: '会员卡种类',
      dataIndex: 'type',
      valueEnum: {
        1: {
          text: '月卡',
          status: 'Success',
        },
        2: {
          text: '年卡',
          status: 'Waraning',
        },
      },
    },
    {
      title: '价格',
      dataIndex: 'price',
      hideInForm: true,
      hideInSearch: true,
      renderText: (_, record) => {
        return `${record.price}`;
      },
    },
    {
      title: '有效期',
      dataIndex: 'days',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      hideInSearch: true,
      renderText: (status: number) => {
        switch (status) {
          case 0:
            return '关闭';
          case 1:
            return '开启';
          default:
            return status; // 如果是未知类型,返回原始值
        }
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      hideInForm: true,
      hideInSearch: true,
      render: (_, record) => {
        const createDate = record.createTime ? new Date(record.createTime) : null;
        if (!createDate) {
          return '无';
        }
        const formatDate = (date: Date) => {
          return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(
            date.getDate(),
          ).padStart(2, '0')}`;
        };

        return `${formatDate(createDate)}`;
      },
    },
    {
      title: '最近更新时间',
      dataIndex: 'updateTime',
      hideInForm: true,
      hideInSearch: true,
      render: (_, record) => {
        const updateDate = record.updateTime ? new Date(record.updateTime) : null;
        if (!updateDate) {
          return '无';
        }
        const formatDate = (date: Date) => {
          return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(
            date.getDate(),
          ).padStart(2, '0')}`;
        };

        return `${formatDate(updateDate)}`;
      },
    },

    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        return [
          <a key="details" onClick={() => handleCEdit(record)}>
            编辑
          </a>,
          <a key="modify" onClick={() => handleCEdit(record)}>
            删除
          </a>,
          <a key="end" onClick={() => handleEnd(record)}>
            人员列表
          </a>,
        ];
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
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
              setMergeCFormVisible(true);
              setIsEdit(false);
              //setFormValue({}); // 清空表单数据
              setCurrentRow(null);
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

      <LaunchForm
        visible={launchFormVisible}
        isEdit={isEdit}
        value={currentRow}
        onCancel={() => setLaunchFormVisible(false)}
        onSuccess={() => {
          actionRef.current?.reload(); // 刷新表格数据
          setLaunchFormVisible(false); // 将 MergeForm 设为不可见
        }}
      />
      <CouponDetailForm
        visible={couponDetailFormVisible}
        record={currentRow}
        onCancel={() => setCouponDetailFormVisible(false)}
      />
      <MergeCForm
        visible={mergeCFormVisible}
        isEdit={isEdit}
        value={currentRow}
        onCancel={() => setMergeCFormVisible(false)}
        onSuccess={() => {
          actionRef.current?.reload(); // 刷新表格数据
          setMergeCFormVisible(false); // 将 MergeForm 设为不可见
        }}
      />
    </PageContainer>
  );
};

export default MemberCard;
