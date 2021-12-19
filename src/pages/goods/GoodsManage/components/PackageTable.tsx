import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import { useRef } from 'react';
import type { SideDishGoods } from '../data';
import { Image, Select } from 'antd';
import { nullImage } from '@/consts/consts';
import { getSideDishList } from '../service';
import { useRequest } from 'umi';
import { OptionsType } from '@ant-design/pro-table/lib/components/ToolBar';
import { SelectValue } from 'antd/lib/select';

const { Option } = Select;

export type PackageTableProps = {
  name?: string;
  value?: SideDishGoods[];
  onRemove?: (row: SideDishGoods) => void;
  onChange?: (v: SideDishGoods[]) => void;
};

// export type SelectDataType = {
//   label: string;
//   value: any;
// } & SideDishGoods;

const PackageTable: React.FC<PackageTableProps> = (props) => {
  const actionRef = useRef<ActionType>();
  // const [ds, setDs] = useState<SideDishGoods[]>(props?.value || []);
  // const [options, setOptions] = useState<any[]>([]);

  const searchHandle = async (v: string) => {
    const res = await getSideDishList({ gname: v });
    const arrs = res?.data?.list as SideDishGoods[];
    console.log(arrs);
    return Promise.resolve<SideDishGoods[]>(arrs);
  };

  const { data, loading, run, cancel } = useRequest(searchHandle, {
    debounceInterval: 500,
    manual: true,
  });
  const optionsDom = data?.map((d: SideDishGoods) => (
    <Option key={d.gname} value={d.gname}>
      {d.gname}
    </Option>
  ));

  const selectedHandle = (
    value: SelectValue,
    option: OptionsType | OptionData | OptionGroupData,
  ) => {
    console.log(value);
    console.log(option);
  };

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
      renderFormItem: (_, { isEditable }) => {
        return (
          isEditable && (
            <Select
              showSearch
              // options={options}
              placeholder="输入关键字"
              loading={loading}
              onBlur={cancel}
              onSearch={run}
              onChange={selectedHandle}
              showArrow={false}
              filterOption={false}
            >
              {data && optionsDom}
            </Select>
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
    <EditableProTable<SideDishGoods>
      name={props.name}
      headerTitle="套餐列表"
      actionRef={actionRef}
      rowKey="index"
      search={false}
      columns={columns}
      value={props?.value}
      onChange={props?.onChange}
    />
  );
};

export default PackageTable;
