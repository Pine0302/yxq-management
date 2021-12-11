import { PlusOutlined } from '@ant-design/icons';
import { Button, Image, Switch } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { goodsPageInfo } from './service';
import type { GoodsTableItem, TableListPagination } from './data';

const tableRequest = async (params?: { pageSize: number; current: number }) => {
  const res = await goodsPageInfo({
    ...params,
    pageNum: params?.current,
  });

  return { data: res.data?.list, success: true, total: res.data?.total };
};

const TableList: React.FC = () => {
  /** 新建窗口的弹窗 */
  // const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */

  // const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
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
      render: (_, record) => <Image width={55} src={`http://img.nidcai.com/${record.pic}`} />,
    },
    {
      title: '名称',
      dataIndex: 'gname',
      search: {
        transform: (v) => {
          return {keyword: v};
        }
      }
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
      render: (_, record) => <Switch checkedChildren="上架" unCheckedChildren="下架" checked={record.status} defaultChecked />,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            // handleUpdateModalVisible(true);
            // setCurrentRow(record);
          }}
        >
          配置
        </a>,
        <a key="subscribeAlert">
          订阅警报
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
        size={'large'}
        search={{
          labelWidth: 120,
        }}
        // toolBarRender={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              // handleModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={tableRequest}
        columns={columns}
        pagination={{pageSize: 20}}
        // rowSelection={{
        //   onChange: (_, selectedRows) => {
        //     setSelectedRows(selectedRows);
        //   },
        // }}
      />
      
    </PageContainer>
  );
};

export default TableList;
