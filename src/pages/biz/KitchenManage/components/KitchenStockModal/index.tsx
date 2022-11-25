import { ModalForm, ProFormText } from '@ant-design/pro-form';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { InputNumber, message, Popconfirm } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { editKitchenStock, kitchenStockPageInfo } from '../../service';

type KitchenStockModalProp = {
  value?: any;
  open: boolean;
  onCancel: () => void;
};

type DataItem = {
  kitchenGoodsId: number;
  gid: number;
  gname: string;
  stock: number;
  sold: number;
  newStock: number;
};

const KitchenStockModal: React.FC<KitchenStockModalProp> = (props) => {
  const actionRef = useRef<ActionType>();
  // const [editableKeys, setEditableKeys] = useState<React.Key[]>([]);
  const [ds, setDs] = useState<DataItem[]>([]);

  const fetchData = async () => {
    const res = await kitchenStockPageInfo({
      pageSize: 100,
      pageNum: 1,
      kitchenId: props.value?.id,
    });

    const tmp = res.data.list.sort(
      (a: DataItem, b: DataItem) => a.gid - b.gid,
    );

    setDs([...tmp]);
  };

  const setKitchenStock = async (kitchenGoodsId: number, newStock: number) => {
    return await editKitchenStock({ kitchenGoodsId, stock: newStock });
  };
  const setSellout = async (kitchenGoodsId: number) => {
    await editKitchenStock({ kitchenGoodsId, sellout: 1, stock: 0 });
  };

  const columns: ProColumns<DataItem>[] = [
    {
      title: '商品名称',
      dataIndex: 'gname',
      editable: false,
    },
    {
      title: '已售',
      dataIndex: 'sold',
      editable: false,
    },
    {
      title: '当前库存',
      dataIndex: 'stock',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Popconfirm
          key={`ppp- ${record.kitchenGoodsId}`}
          icon={<></>}
          title={
            <InputNumber
              min={0}
              value={record.stock}
              onChange={(e) => {
                const one = ds.filter((o) => o.kitchenGoodsId == record.kitchenGoodsId);
                const two = ds
                  .filter((o) => o.kitchenGoodsId != record.kitchenGoodsId)
                  .concat([{ ...one[0], stock: e }])
                  .sort((a: DataItem, b: DataItem) => a.kitchenGoodsId - b.kitchenGoodsId);
                setDs([...two]);
              }}
            />
          }
          onConfirm={async () => {
            const res = await setKitchenStock(record.kitchenGoodsId, record.stock);
            if (res.code == 200) {
              await fetchData();
              message.success('操作成功.');
            }
          }}
          okText="保存"
          cancelText="取消"
        >
          <a href="#">调库存</a>
        </Popconfirm>,
        <a
          key="sellout"
          onClick={async () => {
            await setSellout(record.kitchenGoodsId);
            await fetchData();
          }}
        >
          售罄
        </a>,
      ],
    },
  ];

  // const tableRequest = async (params?: { pageSize: number; current: number }) => {
  //   const res = await kitchenStockPageInfo({
  //     ...params,
  //     pageNum: params?.current,
  //     kitchenId: props.value.id,
  //   });

  //   setEditableKeys(res?.data?.list.map((it: DataItem) => it.kitchenGoodsId));

  //   return { data: res.data?.list, success: true, total: res.data?.total };
  // };

  // fetchData();

  useEffect(() => {
    fetchData();
  }, [props.value]);

  return (
    <>
      <ModalForm
        title={'【' + props.value?.name + '】库存调整'}
        visible={props.open}
        onVisibleChange={(v) => {
          if (!v) props.onCancel();
        }}
      >
        <ProFormText name="id" hidden />
        {/* <EditableProTable<any, any>
          actionRef={actionRef}
          style={{ marginBottom: 24 }}
          pagination={{ pageSize: 10 }}
          search={false}
          options={false}
          toolBarRender={false}
          columns={columns}
          request={tableRequest}
          rowKey="kitchenGoodsId"
          recordCreatorProps={false}
          editable={{
            type: 'multiple',
            editableKeys: editableKeys,
            onSave: async (key, row, originRow) => {
              console.log(originRow.stock);

              const res = await setKitchenStock(key as number, row.stock);
              if (res.code === 200) {
                message.success('保存成功.');
                actionRef.current?.reload();
              }
            },
            actionRender: (row, config, defaultDom) => [defaultDom.save],
          }}
        /> */}
        <ProTable<any, any>
          actionRef={actionRef}
          style={{ marginBottom: 24 }}
          pagination={false}
          search={false}
          options={false}
          toolBarRender={false}
          columns={columns}
          dataSource={ds}
          rowKey="kitchenGoodsId"
        />
      </ModalForm>
    </>
  );
};

export default KitchenStockModal;
