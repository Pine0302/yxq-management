import React, { useState } from 'react';
import { Select } from 'antd';
import { getSideDishList } from '../service';
import type { SideDishGoods } from '../data';

const { Option } = Select;

export type SideDishSearchInputProps = {
  value?: any;
  onChange: (v: any) => void;
};

const SideDishSearchInput: React.FC<any> = (props) => {
  const [ds, setDs] = useState<any[]>([]);
  const [value, setValue] = useState<any>(props?.value);


  const handleSearch = async (v: string) => {
    const res = await getSideDishList({ gname: v });
    const arrs = res?.data?.list as SideDishGoods[];
    setDs(arrs);
  };

  const handleChange = (v: any) => {
    setValue(v);
    props?.onChange?.(ds.filter(it => it.id === v)?.[0]);
    // console.log('handleChange', v, ds.filter(it => it.id === v));
  };

  // const handleSelect = (v: any, option: any) => console.log(v, option);
  // console.log('option', data);
  const options = ds?.map((d: SideDishGoods) => (
    <Option key={d.gname} value={d.id}>
      {d.gname}
    </Option>
  ));

  return (
    <Select
      showSearch
      value={value}
      placeholder="请搜索"
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      // loading={loading}
      onSearch={handleSearch}
      onChange={handleChange}
      // onSelect={handleSelect}
      notFoundContent={null}
    >
      {options}
    </Select>
  );
};

export default SideDishSearchInput;
