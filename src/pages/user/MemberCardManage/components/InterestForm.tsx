import React, { useEffect, useRef, useState } from 'react';
import { ModalForm } from '@ant-design/pro-form';
import ProForm, { ProFormSelect, ProFormDigit, ProFormText } from '@ant-design/pro-form';
import type { MemberCardInterestType } from '../data';

import { buildingPageInfo } from '../../../biz/BuildingManage/service';
import { goodsPageInfo } from '../../../goods/GoodsManage/service';
import { userMenuPageInfo } from '../../../system/UserMenu/service';

export type InterestFormProps = {
  visible?: boolean;
  onCancel?: () => void;
  onSubmit?: (values: MemberCardInterestType) => void;
  initialValues?: Partial<MemberCardInterestType>;
};

const buildingSelectRequest = async () => {
  const res = await buildingPageInfo({ current: 1, pageNum: 1, pageSize: 100 });
  return (res.data?.list || []).map((v) => ({
    label: v.areaName,
    value: v.id,
  }));
};

const goodsSelectRequest = async () => {
  const res = await goodsPageInfo({ current: 1, pageNum: 1, pageSize: 1000 });
  return (res.data?.list || []).map((v) => ({
    label: v.gname,
    value: v.id,
  }));
};

// 定义一个异步函数 menuSelectRequest，用于获取菜单选择请求的数据
// 定义一个异步函数 menuSelectRequest，用于获取菜单选择请求的数据
// 调用 userMenuPageInfo 函数，传入参数 { current: 1, pageNum: 1, pageSize: 100 }
// 该函数可能是从某个 API 获取用户菜单页面的信息
const menuSelectRequest = async () => {
  const res = await userMenuPageInfo({ current: 1, pageNum: 1, pageSize: 100 });
  return (res.data?.list || []).map((v) => ({
    label: v.name,
    value: v.id,
  }));
};

const InterestForm: React.FC<InterestFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
}) => {
  const [buildingOptions, setBuildingOptions] = useState<{ label: string; value: string }[]>([]);
  const [goodsOptions, setGoodsOptions] = useState<{ label: string; value: string }[]>([]);
  const [menuOptions, setMenuOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    console.log('initialValues', initialValues);
    // 获取楼宇选项
    const fetchBuildingOptions = async () => {
      const options = await buildingSelectRequest();
      setBuildingOptions(options);
    };
    fetchBuildingOptions();

    // 获取商品选项
    const fetchGoodsOptions = async () => {
      const options = await goodsSelectRequest();
      setGoodsOptions(options);
    };
    fetchGoodsOptions();

    //获取类目选项
    const fetchMenuOptions = async () => {
      const options = await menuSelectRequest();
      setMenuOptions(options);
    };
    fetchMenuOptions();
    // 获取选项的逻辑...
  }, [visible, initialValues]); // 添加 visible 和 initialValues 作为依赖

  return (
    <ModalForm<MemberCardInterestType>
      title={initialValues?.id ? '编辑权益' : '新增权益'}
      visible={visible}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => onCancel?.(),
      }}
      onFinish={async (values) => {
        onSubmit?.({ ...initialValues, ...values });
        return true;
      }}
      initialValues={initialValues}
    >
      <ProFormSelect
        name="type"
        label="权益类型"
        valueEnum={{
          1: '折扣券',
        }}
        rules={[{ required: true, message: '请选择权益类型' }]}
      />

      <ProFormDigit
        name="number"
        label="折扣力度"
        min={1}
        max={100}
        addonAfter="%"
        rules={[{ required: true, message: '请输入折扣力度' }]}
      />

      <ProFormText
        name="fixedMenu"
        label="限制商品类目"
        placeholder="请输入商品类目ID，多个用逗号分隔"
      />

      <ProFormText name="gids" label="限制商品" placeholder="请输入商品ID，多个用逗号分隔" />

      <ProFormDigit
        name="useTimes"
        label="使用限制"
        tooltip="0表示不限次数"
        min={0}
        rules={[{ required: true, message: '请输入使用限制次数' }]}
      />

      <ProFormSelect
        name="end"
        label="可使用终端"
        valueEnum={{
          1: '小程序',
          2: 'APP',
          3: 'PC',
        }}
        mode="multiple"
        rules={[{ required: true, message: '请选择至少一个使用终端' }]}
      />
    </ModalForm>
  );
};

export default InterestForm;
