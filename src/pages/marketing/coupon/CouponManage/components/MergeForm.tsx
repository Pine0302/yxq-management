import React, { useEffect, useRef, useState } from 'react';
import type { FormInstance } from '@ant-design/pro-form';
import ProForm from '@ant-design/pro-form';
import {
  ModalForm,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormDependency,
  ProFormDatePicker,
  ProFormCheckbox,
} from '@ant-design/pro-form';
import { Col, Row, Divider, message, Checkbox, Input, Space } from 'antd';

import { buildingPageInfo } from '../../../../biz/BuildingManage/service';
import { goodsPageInfo } from '../../../../goods/GoodsManage/service';
import { userMenuPageInfo } from '../../../../system/UserMenu/service';

import type { RequestOptionsType } from '@ant-design/pro-utils';
import { addCoupon, editCoupon } from '../service';

type MergeFormProps = {
  visible?: boolean;
  onCancel?: () => void;
  isEdit?: boolean;
  value?: any;
  onSuccess?: () => void;
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

const menuSelectRequest = async () => {
  const res = await userMenuPageInfo({ current: 1, pageNum: 1, pageSize: 100 });
  return (res.data?.list || []).map((v) => ({
    label: v.name,
    value: v.id,
  }));
};

const handleSubmit = async (values: any, isEdit: boolean = false) => {
  // Placeholder for submit logic

  console.log('Submit-values', values);

  // 打印 fixedArea 详细内容
  console.log('Fixed Area:', values.fixedArea);

  // 打印 fixedGoods 详细内容
  console.log('Fixed Goods:', values.fixedGoods);

  if (!values?.id) {
    console.log('add');
    return await addCoupon(values);
  } else {
    console.log('edit');
    return await editCoupon(values);
  }
  // return isEdit ? await updateItem(values) : await createItem(values);
};

const requiredRule = { rules: [{ required: true }] };

const MergeForm: React.FC<MergeFormProps> = ({ visible, onCancel, isEdit, value, onSuccess }) => {
  const formRef = useRef<FormInstance<any>>();
  const [buildingOptions, setBuildingOptions] = useState<{ label: string; value: string }[]>([]);
  const [goodsOptions, setGoodsOptions] = useState<{ label: string; value: string }[]>([]);
  const [menuOptions, setMenuOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    console.log('activityAreas:', value?.activityAreas);
    if (visible && value) {
      const initialTotalAmountType = value.sendLimit === 0 ? 'unlimited' : 'limited';

      const areaIds =
        value.activityAreas && value.activityAreas.length > 0
          ? value.activityAreas.map((area: any) => area.id)
          : [];
      console.log('areaIds:', areaIds);

      // formRef.current?.setFieldsValue({
      //   ...value,
      //   applicableBuildingsType: areaIds.length > 0 ? 'specific' : 'all',
      //   fixedArea: areaIds,
      // });
      //console.log('Form values set:', formRef.current?.getFieldsValue()); // 检查表单设值后的数据

      const goodsIds =
        value.activityGoods && value.activityGoods.length > 0
          ? value.activityGoods.map((goods: any) => goods.id)
          : [];
      console.log('goodsIds:', goodsIds);

      const menuIds =
        value.activityMenu && value.activityMenu.length > 0
          ? value.activityMenu.map((menu: any) => menu.id)
          : [];
      console.log('menuIds:', menuIds);

      formRef.current?.setFieldsValue({
        ...value,
        applicableTotalAmountType: initialTotalAmountType,
        totalAmount: initialTotalAmountType === 'unlimited' ? 100000 : value.totalAmount,
        applicableBuildingsType: areaIds.length > 0 ? 'specific' : 'all',
        fixedArea: areaIds,
        applicableGoodsType: goodsIds.length > 0 ? 'specific' : 'all',
        fixedGoods: goodsIds,
        applicableMenuType: menuIds.length > 0 ? 'specific' : 'all',
        fixedMenu: menuIds,
        // 如果是礼品券，重置类目相关字段
        ...(value.type === 'PRESENT' && {
          applicableMenuType: 'all',
          fixedMenu: [],
        }),
      });

      console.log('Form values set:', formRef.current?.getFieldsValue()); // 检查表单设值后的数据
    } else if (!visible) {
      formRef.current?.resetFields();
    }
  }, [visible, value, isEdit]);

  return (
    <ModalForm
      title={isEdit ? '编辑优惠券' : '新增优惠券'}
      formRef={formRef}
      layout="horizontal"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      modalProps={{
        destroyOnClose: true, // 确保关闭时销毁表单
        onCancel: onCancel,
        bodyStyle: { maxHeight: '80vh', maxWidth: '80vh', overflow: 'auto' },
      }}
      // ...其他属性保持不变
      onValuesChange={(changedValues, allValues) => {
        if ('type' in changedValues) {
          if (changedValues.type === 'PRESENT') {
            formRef.current?.setFieldsValue({ reduce: 0 });
          }
        }
      }}
      visible={visible}
      onFinish={async (values) => {
        try {
          // 新增礼品券校验
          if (values.type === 'PRESENT') {
            if (
              values.applicableGoodsType !== 'specific' ||
              !values.fixedGoods
              //values.fixedGoods.length !== 1
            ) {
              message.error('礼品券只能选择一个商品');
              throw new Error('礼品券必须指定且只能选择一个商品');
            }
          }

          console.log('values.fixedArea1:', values.fixedArea);
          if (values.applicableBuildingsType === 'all') {
            // values.fixedArea = '-1'; // 如果选择了通用，将 fixedArea 设置为 -1
          } else if (values.applicableBuildingsType === 'specific') {
            // values.fixedArea = values.fixedArea.join(','); // 如果是指定楼宇，确保 fixedArea 是一个字符串
            //在这里增加判断,如果 values.fixedArea 是一个纯数字的数组,则不做下面的过滤处理
            if (
              Array.isArray(values.fixedArea) &&
              values.fixedArea.every((item: any) => typeof item === 'number')
            ) {
            } else {
              values.fixedArea = values.fixedArea
                .map((item: { value: number }) => item.value)
                .join(',');
            }
          }
          console.log('values.fixedGoods1:', values.fixedGoods);
          if (values.applicableGoodsType === 'all') {
            // values.fixedArea = '-1'; // 如果选择了通用，将 fixedArea 设置为 -1
          } else if (values.applicableGoodsType === 'specific') {
            // values.fixedArea = values.fixedArea.join(','); // 如果是指定楼宇，确保 fixedArea 是一个字符串
            if (values.type === 'PRESENT') {
              if (
                Array.isArray(values.fixedGoods) &&
                values.fixedGoods.every((item: any) => typeof item === 'number')
              ) {
                message.error('提交失败，请重新选择商品');
                return;
              }
            }
            if (
              Array.isArray(values.fixedGoods) &&
              values.fixedGoods.every((item: any) => typeof item === 'number')
            ) {
            } else {
              if (values.type === 'PRESENT') {
                values.fixedGoods = values.fixedGoods.value;
              } else {
                values.fixedGoods = values.fixedGoods
                  .map((item: { value: number }) => item.value)
                  .join(',');
              }
            }
          }

          console.log('values.fixedMenu1:', values.fixedMenu);
          if (values.applicableMenuType === 'all') {
            // values.fixedArea = '-1'; // 如果选择了通用，将 fixedArea 设置为 -1
          } else if (values.applicableMenuType === 'specific') {
            // values.fixedArea = values.fixedArea.join(','); // 如果是指定楼宇，确保 fixedArea 是一个字符串
            if (
              Array.isArray(values.fixedMenu) &&
              values.fixedMenu.every((item: any) => typeof item === 'number')
            ) {
            } else {
              values.fixedMenu = values.fixedMenu
                .map((item: { value: number }) => item.value)
                .join(',');
            }
          }

          console.log('开始提交1');
          await handleSubmit(values, isEdit);
          message.success('提交成功');
          if (onSuccess) {
            onSuccess(); // 调用 onSuccess 回调函数
          } else {
            window.location.reload(); // 刷新页面
          }
        } catch (error) {
          console.error('提交失败:', error);
          message.error('提交失败，请重试');
        }
      }}
    >
      <Divider orientation="left">基本信息</Divider>
      <ProFormText
        name="id"
        hidden={true} // 隐藏输入框
        initialValue={isEdit ? value?.id : undefined} // 在编辑状态下设置初始值
      />
      <Row>
        <Col span={16}>
          <ProFormSelect
            {...requiredRule}
            request={async () => [
              { value: 'DISCOUNT', label: '折扣券' },
              { value: 'FULL_REDUCE', label: '满减券' },
              { value: 'PRESENT', label: '礼品馈赠券' },
            ]}
            name="type"
            label="卡券类型"
          />
        </Col>
      </Row>
      <Row>
        <Col span={16}>
          <ProFormText
            name="name"
            label="券名称"
            placeholder="请输入卡券名称，限20字"
            fieldProps={{
              maxLength: 20,
              showCount: true,
            }}
            rules={[
              { required: true, message: '请输入卡券名称' },
              { max: 20, message: '卡券名称不能超过20个字符' },
            ]}
          />
        </Col>
      </Row>
      <Row>
        <Col span={40}>
          <ProForm.Group>
            <Row gutter={22} align="middle">
              {/* 左侧标签+单选框组 */}
              <Col span={16} style={{ display: 'flex', alignItems: 'left' }}>
                <ProFormRadio.Group
                  name="applicableTotalAmountType"
                  label="总投放数"
                  initialValue="unlimited"
                  labelCol={{ span: 12 }} // 增加标签占比
                  wrapperCol={{ span: 18 }}
                  options={[
                    { label: '不限制', value: 'unlimited' },
                    { label: '限制数量', value: 'limited' },
                  ]}
                  rules={[{ required: true, message: '请选择投放数量类型' }]}
                  fieldProps={{
                    style: {
                      display: 'flex',
                      gap: '16px',
                      alignItems: 'center',
                      whiteSpace: 'nowrap',
                    },
                  }}
                />
              </Col>

              {/* 右侧数字输入框 */}
              <Col span={6}>
                <ProFormDependency name={['applicableTotalAmountType']}>
                  {({ applicableTotalAmountType }) => {
                    if (applicableTotalAmountType === 'limited') {
                      return (
                        <ProFormDigit
                          name="totalAmount"
                          label=" "
                          min={1}
                          placeholder="请输入总投放数"
                          rules={[{ required: true, message: '请输入总投放数' }]}
                          fieldProps={{
                            style: {
                              width: '100%',
                              maxWidth: '200px',
                            },
                          }}
                        />
                      );
                    }
                    return (
                      <ProFormDigit
                        name="totalAmount"
                        label=" "
                        disabled
                        hidden={true}
                        initialValue={100000}
                      />
                    );
                  }}
                </ProFormDependency>
              </Col>
            </Row>
          </ProForm.Group>
        </Col>
      </Row>

      <ProFormDependency name={['type']}>
        {({ type }) => {
          const isPresent = type === 'PRESENT';
          return isPresent ? (
            <Row>
              <Col span={16}>
                <ProFormRadio.Group
                  name="presentType"
                  label="馈赠礼品"
                  initialValue="PRESENT"
                  options={[
                    {
                      label: '买一赠一',
                      value: 'PRESENT',
                      disabled: true,
                    },
                  ]}
                  rules={[{ required: true, message: '请选择馈赠类型' }]}
                  fieldProps={{
                    optionType: 'button',
                    buttonStyle: 'solid',
                  }}
                />
              </Col>
            </Row>
          ) : null;
        }}
      </ProFormDependency>

      <Row>
        <Col span={16}>
          <ProFormDependency name={['type']}>
            {({ type }) => {
              const isPresent = type === 'PRESENT';

              return !isPresent ? (
                <ProFormDigit
                  label="面值"
                  name="reduce"
                  width="sm"
                  min={type === 'FULL_REDUCE' ? 1 : 0}
                  max={type === 'DISCOUNT' ? 100 : undefined}
                  fieldProps={{
                    step: type === 'DISCOUNT' || type === 'FULL_REDUCE' ? 1 : 0.01,
                    precision: type === 'DISCOUNT' || type === 'FULL_REDUCE' ? 0 : 2,
                  }}
                  rules={[
                    { required: true, message: '请输入面值' },
                    {
                      type: 'number',
                      min: type === 'FULL_REDUCE' ? 1 : 0,
                      message:
                        type === 'DISCOUNT'
                          ? '面值不能小于0'
                          : type === 'FULL_REDUCE'
                          ? '面值必须大于0'
                          : '面值不能为负数',
                    },
                    type === 'DISCOUNT' || type === 'FULL_REDUCE'
                      ? {
                          validator: (_, val) =>
                            Number.isInteger(val)
                              ? Promise.resolve()
                              : Promise.reject(
                                  type === 'DISCOUNT'
                                    ? '折扣券面值必须为整数'
                                    : '满减券面值必须为整数',
                                ),
                        }
                      : {},
                  ]}
                />
              ) : null;
            }}
          </ProFormDependency>
        </Col>
      </Row>
      <Row>
        <Col span={16}>
          <ProFormDigit
            label="门槛金额"
            name="payFull"
            placeholder="订单满 x 可用，数量不能为且不能低于面值金额"
            fieldProps={{
              style: { width: '100%' },
            }}
            rules={[
              { required: true, message: '请输入门槛金额' },
              { type: 'number', min: 0, message: '门槛金额不能为负数' },
              // 这里可以添加自定义验证规则来确保门槛金额不低于面值金额
            ]}
          />
        </Col>
      </Row>
      <Row>
        <Col span={16}>
          <ProFormText
            name="remark"
            label="使用规则："
            placeholder="满xx元可用"
            rules={[{ required: true, message: '请输入使用规则说明' }]}
          />
        </Col>
      </Row>
      <Divider orientation="left">领取和使用规则</Divider>
      <ProFormRadio.Group
        name="receiveTimeLimit"
        label="领取时限："
        labelCol={{ span: 4 }} // 控制标签的宽度
        wrapperCol={{ span: 20 }} // 控制输入框的宽度
        options={[
          { label: '不限日期，投放后长期可用', value: 'unlimited' },
          { label: '固定日期', value: 'fixed', disabled: true }, // 禁用固定日期选项
        ]}
        initialValue="unlimited" // 设置默认值为不限制
        rules={[{ required: true, message: '请选择领取时限' }]}
      />
      <ProFormDependency name={['receiveTimeLimit']}>
        {({ receiveTimeLimit }) => {
          if (receiveTimeLimit === 'fixed') {
            return (
              <>
                <ProFormDatePicker
                  name="receiveStartTime"
                  label="开始时间"
                  labelCol={{ span: 4 }} // 控制标签的宽度
                  wrapperCol={{ span: 20 }} // 控制输入框的宽度
                  rules={[{ required: true, message: '请选择开始时间' }]}
                />
                <ProFormDatePicker
                  name="receiveEndTime"
                  label="结束时间"
                  labelCol={{ span: 4 }} // 控制标签的宽度
                  wrapperCol={{ span: 20 }} // 控制输入框的宽度
                  rules={[{ required: true, message: '请选择结束时间' }]}
                />
              </>
            );
          }
          return null;
        }}
      </ProFormDependency>
      <ProFormDigit
        name="limitPerUser"
        label="每人限领次数："
        labelCol={{ span: 4 }} // 控制标签的宽度
        wrapperCol={{ span: 20 }} // 控制输入框的宽度
        initialValue={1} // 默认值为1
        min={1} // 最小值为1
        fieldProps={{
          formatter: (val) => `${val}`, // 将 value 改为 val
          disabled: true, // 禁用输入框
          style: { width: '100px' }, // 设置输入框宽度
        }}
        rules={[{ required: true, message: '请输入每人限领次数' }]}
      />
      <Row>
        <Col span={24}>
          <ProFormDigit
            name="useDuration"
            label="用券有效时间："
            placeholder="请输入用有效时间（天）"
            min={1} // 最小为1
            labelCol={{ span: 4 }} // 控制标签的宽度
            wrapperCol={{ span: 20 }} // 控制输入框的宽度
            fieldProps={{
              style: { width: '100px' }, // 设置输入框宽度
            }}
            rules={[{ required: true, message: '请输入用券有效时间' }]}
          />
        </Col>
      </Row>
      <Divider orientation="left">使用范围</Divider>
      <Row gutter={16}>
        <Col span={12}>
          <ProFormRadio.Group
            {...requiredRule}
            name="deliveryFree"
            label="减免配送费"
            labelCol={{ span: 8 }} // 控制标签的宽度
            wrapperCol={{ span: 16 }} // 控制输入框的宽度
            radioType="button"
            options={[
              { label: '是', value: true },
              { label: '否', value: false },
            ]}
          />
        </Col>
        <Col span={12}>
          <ProFormRadio.Group
            {...requiredRule}
            name="packageFree"
            label="减免打包费"
            labelCol={{ span: 8 }} // 控制标签的宽度
            wrapperCol={{ span: 16 }} // 控制输入框的宽度
            radioType="button"
            options={[
              { label: '是', value: true },
              { label: '否', value: false },
            ]}
          />
        </Col>
      </Row>

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

      {/* 修改适用商品部分 */}
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
                        placeholder: '请选择可使用商品1',
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
      <Divider orientation="left">叠加使用</Divider>
      <Row gutter={16}>
        <Col span={24}>
          <ProFormRadio.Group
            name="multiple"
            label="是否允许叠加"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            options={[
              // { label: '是', value: true },
              { label: '否', value: 0 },
            ]}
            initialValue={0} // 默认选择否
            rules={[{ required: true, message: '请选择是否允许叠加' }]}
          />
        </Col>
      </Row>
      <Divider orientation="left">短信提醒</Divider>
      <Row gutter={16}>
        <Col span={24}>
          <ProFormCheckbox
            name="receiveRemind"
            label="领取提醒："
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 20 }}
            initialValue={true}
            transform={(checked) => ({ receiveRemind: checked ? '1' : '0' })} // 确保转换后的值被正确传递
          >
            领取成功时提醒
          </ProFormCheckbox>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <ProForm.Group>
            <ProFormCheckbox
              name="expireRemind"
              initialValue={true}
              label="过期提醒："
              labelCol={{ span: 12 }}
              wrapperCol={{ span: 20 }}
              transform={(checked) => ({ expireRemind: checked ? '1' : '0' })} // 确保转换后的值被正确传递
            >
              到期
            </ProFormCheckbox>
            <ProFormDigit
              name="expireRemindDays"
              width="xs"
              min={1}
              max={30}
              initialValue={3}
              fieldProps={{
                addonAfter: '天前提醒',
                style: { width: '50px' },
              }}
              label=""
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 20 }}
            />
          </ProForm.Group>
        </Col>
      </Row>
    </ModalForm>
  );
};

export default MergeForm;
