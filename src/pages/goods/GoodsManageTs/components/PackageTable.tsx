import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useRef } from 'react';
import type { SideDishGoods } from '../data';
import { Image } from 'antd';
import { nullImage } from '@/consts/consts';
import SideDishSearchInput from './SideDishSearchInput';
import SideDishGoodsSelectModal from './SideDishGoodsSelectModal';

export type PackageTableProps = {
  name?: string;
  value?: SideDishGoods[];
  onRemove?: (row: SideDishGoods) => void;
  onAdd?: (values: any) => void;
};

const PackageTable: React.FC<PackageTableProps> = (props) => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<SideDishGoods>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '商品名称',
      dataIndex: 'gname',
      hideInSearch: true,
      renderFormItem: (schema, { isEditable }, form) => {
        return (
          isEditable && (
            <SideDishSearchInput
              name="aaa"
              onChange={(v: any) => {
                console.log('parent onChange', v);
                // console.log('props.value', props?.value);
                console.log('form', form.getFieldsValue());

                console.log('values ', props?.value);
              }}
            />
          )
        );
      },
    },
    {
      title: '图片',
      dataIndex: 'pic',
      hideInSearch: true,
      renderFormItem: () => null,
      render: (_, row) => (
        <Image width={50} src={`https://img.nidcai.com${row.pic}`} fallback={nullImage} />
      ),
    },
    {
      title: '类型',
      dataIndex: 'relationType',
      valueEnum: {
        MAST_CHOICE: {
          text: '必选',
          color: 'green',
        },
        SIDE_DISH: {
          text: '小菜',
          color: 'pink',
        },
        SOUP: {
          text: '例汤',
          color: 'blue',
        },
      },
      hideInSearch: true,
    },
    {
      title: '单价',
      dataIndex: 'price',
      valueType: 'money',
      hideInSearch: true,
      renderFormItem: () => null,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a key="remove" onClick={() => props?.onRemove?.(record)}>
          删除
        </a>,
      ],
    },
  ];

  return (
    <ProTable<SideDishGoods>
      headerTitle="套餐列表"
      actionRef={actionRef}
      rowKey="id"
      search={false}
      columns={columns}
      dataSource={props?.value}
      pagination={false}
      toolBarRender={() => [
        <SideDishGoodsSelectModal
          onFinish={async (values: any) => {
            props?.onAdd?.(values);
          }}
        />,
      ]}
    />
  );
};

export default PackageTable;
