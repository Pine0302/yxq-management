import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Image, Popconfirm, Switch } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { goodsPageInfo, updateGoodsStatus } from './service';
import type { GoodsTableItem, TableListPagination } from './data';
import { nullImage } from '@/consts/consts';
import MergeDrawerForm from './components/MergeDrawerForm';
import * as styles from './style.less';

const tableRequest = async (params?: { pageSize: number; current: number }) => {
  const res = await goodsPageInfo({
    ...params,
    pageNum: params?.current,
    source: 2,
  });

  return { data: res.data?.list, success: true, total: res.data?.total };
};

const TableList: React.FC = () => {
  const [mergeModalVisible, setMergeModalVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [row, setRow] = useState<any>();

  const actionRef = useRef<ActionType>();
  //tab 全部 上架 下架
  const [tabActivekey, setTabActivekey] = useState<React.Key>('all');
  const [tableParams, setTableParams] = useState<TableListPagination>();

  //switch 上/下架
  const handleSwitch = async (id: number | undefined, status: boolean | undefined) => {
    const status2: number = status ? 1 : 0;
    const res = await updateGoodsStatus({ id: id, status: status2 });
    if (res.data === true) actionRef.current?.reload();
  };
  // '🌶️'
  const columns: ProColumns<GoodsTableItem>[] = [
    {
      title: '菜品名称',
      width: 300,
      dataIndex: 'pic',
      hideInSearch: true,
      render: (_, record) => (
        <>
          <div className={styles.goodWrapper}>
            <span>
              <Image width={55} src={`http://img.nidcai.com/${record.pic}`} fallback={nullImage} />
            </span>
            <span className={styles.marginLeft}>
              <div>{record?.gname}</div>
              <div>{'🌶️'.repeat(record?.pepper as number)}</div>
            </span>
          </div>
        </>
      ),
    },
    {
      title: '名称',
      dataIndex: 'gname',
      hideInTable: true,
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
      render: (_, record) => (
        <>
          <div>划线价：￥{record.originalPrice}</div>
          <div>销售价：￥{record.price}</div>
        </>
      ),
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
        <Popconfirm
          title="确定要这么操作吗？"
          icon={<QuestionCircleOutlined />}
          onConfirm={async () => {
            await handleSwitch(record.id, !record.status);
          }}
        >
          <Switch
            checkedChildren="上架"
            unCheckedChildren="下架"
            checked={record.status}
            defaultChecked
          />
        </Popconfirm>
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
            setRow({ ...record });
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
        // headerTitle="查询表格"
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
              setRow({});
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={tableRequest}
        params={tableParams}
        columns={columns}
        pagination={{ pageSize: 20 }}
        toolbar={{
          menu: {
            type: 'tab',
            activeKey: tabActivekey,
            items: [
              {
                key: 'all',
                label: <span>全部</span>,
              },
              {
                key: 'up',
                label: <span>上架</span>,
              },
              {
                key: 'down',
                label: <span>下架</span>,
              },
            ],
            onChange: (key) => {
              const keyStr = key as string;
              setTabActivekey(keyStr);

              let status: number | undefined;
              if (keyStr === 'up') status = 1;
              else if (keyStr === 'down') status = 0;

              const params = { ...tableParams, status } as TableListPagination;
              setTableParams(params);
            },
          },
        }}
      />

      <MergeDrawerForm
        modalVisible={mergeModalVisible}
        isEdit={isEdit}
        onCancel={() => {
          setMergeModalVisible(false);
          actionRef.current?.reload();
        }}
        value={row}
      />
    </PageContainer>
  );
};

export default TableList;
