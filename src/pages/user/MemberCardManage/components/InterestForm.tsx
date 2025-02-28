import React, { useEffect, useRef, useState } from 'react';
import {
  ProFormSelect,
  ProFormDigit,
  ProFormText,
  FormInstance,
  ModalForm,
  ProFormRadio,
  ProFormDependency,
} from '@ant-design/pro-form';
import type { MemberCardInterestType } from '../data';
import { Col, Row, message } from 'antd';
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
  const formRef = useRef<FormInstance>();

  const [buildingOptions, setBuildingOptions] = useState<{ label: string; value: string }[]>([]);
  const [goodsOptions, setGoodsOptions] = useState<{ label: string; value: string }[]>([]);
  const [menuOptions, setMenuOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    console.log('qqq:', 123);
    console.log(':', 123);

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

    // 获取类目选项
    const fetchMenuOptions = async () => {
      const options = await menuSelectRequest();
      setMenuOptions(options);
    };
    fetchMenuOptions();
  }, []); // 添加空依赖数组，只在挂载时执行一次

  // 在MergeForm.tsx中添加调试效果
  // useEffect(() => {
  //   console.log('当前选中的权益列表:', selectedInterests);
  // }, [selectedInterests]);

  // useEffect(() => {
  //   if (visible && initialValues) {
  //     console.log('activityAreas:', initialValues?.activityAreas);
  //     const areaIds =
  //       initialValues.activityAreas && initialValues.activityAreas.length > 0
  //         ? initialValues.activityAreas.map((area: any) => area.id)
  //         : [];
  //     console.log('areaIds:', areaIds);

  //     const goodsIds =
  //       initialValues.activityGoods && initialValues.activityGoods.length > 0
  //         ? initialValues.activityGoods.map((goods: any) => goods.id)
  //         : [];
  //     console.log('goodsIds:', goodsIds);

  //     const menuIds =
  //       initialValues.activityMenu && initialValues.activityMenu.length > 0
  //         ? initialValues.activityMenu.map((menu: any) => menu.id)
  //         : [];
  //     console.log('menuIds:', menuIds);

  //     // 转换回显数据：ID数组 -> 选择器需要的对象格式
  //     const formattedValues = {
  //       ...initialValues,
  //       fixedMenu: initialValues.fixedMenu?.map(
  //         (id) =>
  //           menuOptions.find((opt) => opt.value === id) || { label: `未知类目${id}`, value: id },
  //       ),
  //       fixedGoods: initialValues.fixedGoods?.map(
  //         (id) =>
  //           goodsOptions.find((opt) => opt.value === id) || { label: `未知商品${id}`, value: id },
  //       ),
  //       fixedArea: initialValues.fixedArea?.map(
  //         (id) =>
  //           buildingOptions.find((opt) => opt.value === id) || {
  //             label: `未知楼宇${id}`,
  //             value: id,
  //           },
  //       ),
  //       applicableBuildingsType: areaIds.length > 0 ? 'specific' : 'all',

  //       applicableGoodsType: goodsIds.length > 0 ? 'specific' : 'all',

  //       applicableMenuType: menuIds.length > 0 ? 'specific' : 'all',
  //     };

  //     formRef.current?.setFieldsValue(formattedValues);
  //   }
  // }, [visible, initialValues, menuOptions, goodsOptions, buildingOptions]);

  useEffect(() => {
    if (visible) {
      // 每次打开弹窗时重置表单
      formRef.current?.resetFields();
      formRef.current?.setFieldsValue(initialValues);
      console.log('initialValues:', initialValues); // 检查表单设值后的数据0
      console.log('可以使用的终端:', initialValues?.end); // 检查表单设值后的数据0  可以使用的终端: 1,2

      if (initialValues) {
        console.log('activityAreas:', initialValues?.activityAreas);
        let areaIds =
          initialValues.activityAreas && initialValues.activityAreas.length > 0
            ? initialValues.activityAreas.map((area: any) => area.id)
            : [];
        if (areaIds.length === 0 && initialValues.fixedArea != null) {
          areaIds = initialValues.fixedArea;
        }
        console.log('areaIds:', areaIds);

        let goodsIds =
          initialValues.activityGoods && initialValues.activityGoods.length > 0
            ? initialValues.activityGoods.map((goods: any) => goods.id)
            : [];

        if (goodsIds.length === 0 && initialValues.fixedGoods != null) {
          goodsIds = initialValues.fixedArea;
        }
        console.log('goodsIds:', goodsIds);

        let menuIds =
          initialValues.activityMenu && initialValues.activityMenu.length > 0
            ? initialValues.activityMenu.map((menu: any) => menu.id)
            : [];
        if (menuIds.length === 0 && initialValues.fixedMenu != null) {
          menuIds = initialValues.fixedMenu;
        }
        console.log('menuIds:', menuIds);

        formRef.current?.setFieldsValue({
          ...initialValues,
          applicableBuildingsType: areaIds.length > 0 ? 'specific' : 'all',
          fixedArea: areaIds,
          applicableGoodsType: goodsIds.length > 0 ? 'specific' : 'all',
          fixedGoods: goodsIds,
          applicableMenuType: menuIds.length > 0 ? 'specific' : 'all',
          fixedMenu: menuIds,
          end: initialValues?.end
            ? Array.isArray(initialValues.end)
              ? initialValues.end.map(String) // 确保数组元素为字符串
              : initialValues.end.split(',').map((item) => item.trim())
            : [],
        });
        console.log('处理后的end值:', initialValues?.end);
        console.log('表单当前end值:', formRef.current?.getFieldValue('end'));
      }
      console.log('Form values set:', formRef.current?.getFieldsValue()); // 检查表单设值后的数据0
    } else if (!visible) {
      formRef.current?.resetFields();
    }

    //获取选项的逻辑...
  }, [visible, initialValues]); // 添加 visible 和 initialValues 作为依赖

  return (
    <ModalForm<MemberCardInterestType>
      formRef={formRef}
      title={initialValues?.id ? '编辑权益' : '新增权益'}
      visible={visible}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => onCancel?.(),
      }}
      onFinish={async (values) => {
        console.log('Form values:', values); // 提交表单时打印表单数据
        if (
          Array.isArray(values.fixedMenu) &&
          values.fixedMenu.every((item: any) => typeof item === 'number')
        ) {
        } else {
          values.fixedMenu = values.fixedMenu?.map((item: any) => item.value) || [];
        }
        if (
          Array.isArray(values.fixedGoods) &&
          values.fixedGoods.every((item: any) => typeof item === 'number')
        ) {
        } else {
          values.fixedGoods = values.fixedGoods?.map((item: any) => item.value) || [];
        }

        if (
          Array.isArray(values.fixedArea) &&
          values.fixedArea.every((item: any) => typeof item === 'number')
        ) {
        } else {
          values.fixedArea = values.fixedArea?.map((item: any) => item.value) || [];
        }

        const transformValues = {
          ...values,
          // fixedMenu: values.fixedMenu?.map((item: any) => item.value) || [],
          // fixedGoods: values.fixedGoods?.map((item: any) => item.value) || [],
          // fixedArea: values.fixedArea?.map((item: any) => item.value) || [],
        };

        console.log('处理后的表单值:', transformValues);
        onSubmit?.(transformValues);
        // onSubmit?.({
        //   ...initialValues,
        //   ...values,
        // });
        return true;
      }}
      // initialValues={{
      //   ...initialValues,
      //   end: initialValues?.end
      //     ? Array.isArray(initialValues.end)
      //       ? initialValues.end.map(String) // 确保数组元素为字符串
      //       : initialValues.end.split(',').map((item) => item.trim())
      //     : [],
      // }}
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

      {/* 原代码中的适用类目部分修改如下 */}
      <ProFormDependency name={['applicableMenuType', 'type']}>
        {({ applicableMenuType, type }) => {
          // 当选择礼品券时隐藏整个类目模块
          if (type === 'PRESENT') return null;

          return (
            <>
              <Row gutter={16}>
                <Col span={24}>
                  <ProFormRadio.Group
                    name="applicableMenuType"
                    label="适用类目"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    options={[
                      { label: '全部', value: 'all' },
                      { label: '指定类目', value: 'specific' },
                    ]}
                    initialValue="all"
                    rules={[{ required: true, message: '请选择适用类目' }]}
                  />
                </Col>
              </Row>

              {applicableMenuType === 'specific' && (
                <Row>
                  <Col span={24}>
                    <ProFormSelect
                      name="fixedMenu"
                      label="可使用类目"
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 20 }}
                      mode="multiple"
                      options={menuOptions}
                      fieldProps={{
                        placeholder: '请选择可使用类目',
                        labelInValue: true,
                      }}
                      rules={[{ required: true, message: '请选择可使用类目' }]}
                    />
                  </Col>
                </Row>
              )}
            </>
          );
        }}
      </ProFormDependency>

      <ProFormDependency name={['type', 'applicableGoodsType']}>
        {({ type, applicableGoodsType }) => {
          const isPresent = type === 'PRESENT';

          return (
            <>
              <Row gutter={16}>
                <Col span={24}>
                  <ProFormRadio.Group
                    name="applicableGoodsType"
                    label="适用商品"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    options={[
                      { label: '全部', value: 'all', disabled: isPresent }, // 礼品券禁用全部选项
                      { label: '指定商品', value: 'specific' },
                    ]}
                    initialValue={isPresent ? 'specific' : 'all'} // 礼品券默认指定商品
                    rules={[
                      {
                        required: true,
                        message: '请选择适用商品',
                        validator: (_, value) => {
                          if (isPresent && value !== 'specific') {
                            return Promise.reject('礼品券必须指定商品');
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  />
                </Col>
              </Row>

              {applicableGoodsType === 'specific' && (
                <Row>
                  <Col span={24}>
                    <ProFormSelect
                      name="fixedGoods"
                      label="可使用商品"
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 20 }}
                      mode={isPresent ? undefined : 'multiple'} // 礼品券切换为单选模式
                      options={goodsOptions}
                      fieldProps={{
                        placeholder: '请选择可使用商品',
                        labelInValue: true,
                        maxTagCount: isPresent ? 1 : undefined, // 礼品券限制选择1个
                        onChange: (selectedValue) => {
                          if (isPresent) {
                            if (selectedValue && selectedValue.length > 1) {
                              message.error('礼品券只能选择一个商品');
                              // 手动限制选择数量，确保 selectedValue 是数组
                              formRef.current?.setFieldsValue({ fixedGoods: [selectedValue[0]] });
                            } else if (selectedValue && selectedValue.length === 1) {
                              // 确保 selectedValue 是数组
                              formRef.current?.setFieldsValue({ fixedGoods: selectedValue });
                            }
                          } else {
                            // 非礼品券模式，直接设置值，确保 selectedValue 是数组
                            formRef.current?.setFieldsValue({ fixedGoods: selectedValue });
                          }
                        },
                      }}
                    />
                  </Col>
                </Row>
              )}
            </>
          );
        }}
      </ProFormDependency>

      <Row>
        <Col span={24}>
          <ProFormRadio.Group
            name="applicableBuildingsType"
            label="适用楼宇"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            options={[
              { label: '通用', value: 'all' },
              { label: '指定楼宇', value: 'specific' },
            ]}
            initialValue="all"
            rules={[{ required: true, message: '请选择适用楼类型' }]}
          />
        </Col>
      </Row>
      <ProFormDependency name={['applicableBuildingsType']}>
        {({ applicableBuildingsType }) => {
          if (applicableBuildingsType === 'specific') {
            return (
              <Row>
                <Col span={24}>
                  <ProFormSelect
                    name="fixedArea"
                    label="参与楼宇"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    mode="multiple"
                    options={buildingOptions}
                    fieldProps={{
                      placeholder: '请选择参与楼宇',
                      labelInValue: true,
                      onChange: (val) => {
                        console.log('Selected buildings:', val); // 直接打印选中的值，确保它们是对象数组
                      },
                    }}
                    rules={[{ required: true, message: '请选择参与楼宇' }]}
                  />
                </Col>
              </Row>
            );
          }
          return null;
        }}
      </ProFormDependency>

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
        mode="multiple"
        options={[
          { label: '小程序', value: '1' },
          { label: 'APP', value: '2' },
        ]}
        fieldProps={{
          optionLabelProp: 'label', // 确保显示标签
          labelInValue: false, // 关闭值包装
        }}
        rules={[{ required: true, message: '请选择至少一个使用终端' }]}
      />
    </ModalForm>
  );
};

export default InterestForm;
