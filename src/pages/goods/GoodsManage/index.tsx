import { PlusOutlined } from '@ant-design/icons';
import { Button, Image, Switch } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { goodsPageInfo } from './service';
import type { GoodsTableItem, TableListPagination } from './data';
import MergeForm from './components/MergeForm';
import { nullImage } from '@/consts/consts';

const tableRequest = async (params?: { pageSize: number; current: number }) => {
  const res = await goodsPageInfo({
    ...params,
    pageNum: params?.current,
  });

  return { data: res.data?.list, success: true, total: res.data?.total };
};

const TableList: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [mergeModalVisible, setMergeModalVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  // const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  // const [currentRow, setCurrentRow] = useState<GoodsTableItem>();
  // const [selectedRowsState, setSelectedRows] = useState<GoodsTableItem[]>([]);
  /** 国际化配置 */

  const columns: ProColumns<GoodsTableItem>[] = [
    {
      title: '图片',
      width: 60,
      dataIndex: 'pic',
      hideInSearch: true,
      render: (_, record) => (
        <Image width={55} src={`http://img.nidcai.com/${record.pic}`} fallback={nullImage} />
      ),
    },
    {
      title: '名称',
      dataIndex: 'gname',
      search: {
        transform: (v) => {
          return { keyword: v };
        },
      },
    },
    {
      title: '价格',
      dataIndex: 'price',
      hideInSearch: true,
      valueType: 'money',
    },
    {
      title: '打包费',
      dataIndex: 'packageFee',
      hideInSearch: true,
      valueType: 'money',
    },
    {
      title: '上/下架',
      dataIndex: 'status',
      hideInSearch: true,
      render: (_, record) => (
        <Switch
          checkedChildren="上架"
          unCheckedChildren="下架"
          checked={record.status}
          defaultChecked
        />
      ),
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            console.log(record);
            setMergeModalVisible(true);
            setIsEdit(true);
          }}
        >
          编辑
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<GoodsTableItem, TableListPagination>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        size={'middle'}
        search={{
          labelWidth: 120,
        }}
        // toolBarRender={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setMergeModalVisible(true);
              setIsEdit(false);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={tableRequest}
        columns={columns}
        pagination={{ pageSize: 20 }}
      />

      <MergeForm
        modalVisible={mergeModalVisible}
        onCancel={() => {
          setMergeModalVisible(false);
        }}
        isEdit={isEdit}
      />
    </PageContainer>
  );
};

export default TableList;
