import React, { useEffect, useRef, useState } from 'react';
import type { FormInstance } from '@ant-design/pro-form';
import {
  ModalForm,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormDependency,
} from '@ant-design/pro-form';
import { Col, Row, Divider, message, Table, Button, Modal, Space, Tag, InputNumber } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { addMemberCard, editMemberCard } from '../service';
import { couponPageInfo } from '../../../marketing/coupon/CouponManage/service';

// 在文件顶部定义常量
const COUPON_TYPE_MAP = {
  PRESENT: '礼品赠送券',
  DISCOUNT: '折扣券',
  FULL_REDUCE: '满减券',
} as const;

export type SelectedCoupon = {
  id: number;
  cardId: number;
  couponId: number;
  name: string;
  nums: number;
  rule: string;
};

export type CouponType = {
  id: number;
  name: string;
  type: string;
  deliveryFree: boolean;
  packageFree: boolean;
  totalAmount: number;
  reduce: number;
  discount: number; //折扣
  startTime: string;
  endTime: string;
  limitPerUser: number;
  remark: string;
  status: boolean;
  sendStatus: number;
};

//绑定的权益类型
export type memberCardInterestType = {
  id: number;
  type: number; //权益类型 1.折扣券
  number: number; //折扣力度
  fixedMenu: string; //限制的商品类目
  gids: string; //限制的商品
  useTimes: number; //使用限制
  end: number; //可使用终端
};

type MergeFormProps = {
  visible?: boolean;
  onCancel?: () => void;
  isEdit?: boolean;
  value?: any;
  onSuccess?: () => void;
};

const requiredRule = { rules: [{ required: true }] };

const MergeForm: React.FC<MergeFormProps> = ({ visible, onCancel, isEdit, value, onSuccess }) => {
  const formRef = useRef<FormInstance<any>>();

  const [showCouponModal, setShowCouponModal] = useState(false);
  const [coupons, setCoupons] = useState<CouponType[]>([]);
  const [selectedCoupons, setSelectedCoupons] = useState<SelectedCoupon[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  // 获取优惠券列表
  const fetchCoupons = async (params: any = {}) => {
    try {
      const response = await couponPageInfo({
        pageNum: params.current || 1, // 根据接口参数调整
        pageSize: params.pageSize || 10,
        ...params,
      });

      console.log('接口返回数据:', response);

      // 确保数据结构正确
      const data = response.data || {};
      const couponList = data.list || []; // 从data.list获取数组

      setCoupons(couponList);
      setPagination({
        current: data.pageNum || 1,
        pageSize: data.pageSize || 10,
        total: data.total || 0,
      });
    } catch (error) {
      message.error('获取优惠券列表失败');
      console.error('获取优惠券列表失败:', error);
      setCoupons([]);
    }
  };

  useEffect(() => {
    if (visible && value) {
      formRef.current?.setFieldsValue({
        ...value,
      });

      console.log('Form values set:', formRef.current?.getFieldsValue()); // 检查表单设值后的数据
    } else if (!visible) {
      formRef.current?.resetFields();
    }
  }, [visible, value, isEdit]);

  ///修改初始化已选优惠券的useEffect
  useEffect(() => {
    if (visible) {
      // 新建模式强制清空
      if (!isEdit) {
        setSelectedCoupons([]);
        return;
      }

      // 仅在编辑模式且有值时初始化
      if (value?.memberCardCouponDTOList) {
        setSelectedCoupons(value.memberCardCouponDTOList);
      }
    } else {
      setSelectedCoupons([]);
    }
  }, [visible, value, isEdit]); // 增加isEdit依赖

  // 新增一个 useEffect 监听 selectedCoupons 的变化
  useEffect(() => {
    console.log('selectedCoupons updated:', selectedCoupons);
  }, [selectedCoupons]);

  useEffect(() => {
    if (showCouponModal) {
      fetchCoupons({ current: 1, pageSize: 10 }); // 首次加载时获取第一页数据
    }
  }, [showCouponModal]); // 监听弹窗显示状态变化

  // 列定义
  const columns: ColumnsType<CouponType> = [
    { title: '优惠券名称', dataIndex: 'name' },
    {
      title: '类型',
      dataIndex: 'type',
      render: (text: keyof typeof COUPON_TYPE_MAP) => COUPON_TYPE_MAP[text] || text,
    },
    { title: '面值', dataIndex: 'reduce' },
    { title: '有效期', dataIndex: 'useDuration' },
    {
      title: '操作',
      render: (_, record) => {
        // 检查是否已存在选中列表
        const isSelected = selectedCoupons.some((item) => item.couponId === record.id);

        return (
          <Space>
            <Button
              type="link"
              disabled={isSelected}
              onClick={() => {
                setSelectedCoupons((prev) => [
                  ...prev,
                  {
                    id: Date.now(), // 生成临时唯一ID
                    cardId: value?.id || 0,
                    couponId: record.id,
                    name: record.name,
                    nums: 1,
                    rule: '开卡后领取', // 新增默认规则
                    key: `${value?.id || 'new'}-${record.id}`,
                  },
                ]);
                setShowCouponModal(false);
              }}
            >
              {isSelected ? '已添加' : '选择'}
            </Button>
            {isSelected && <Tag color="green">已选择</Tag>}
          </Space>
        );
      },
    },
  ];

  // 已选列表列定义
  const selectedColumns: ColumnsType<SelectedCoupon> = [
    { title: '优惠券', dataIndex: 'name' },
    {
      title: '赠送数量',
      dataIndex: 'nums',
      render: (text, record, index) => (
        <InputNumber
          min={1}
          value={selectedCoupons[index]?.nums} // 直接绑定状态值
          onChange={(val) => {
            const newList = [...selectedCoupons];
            newList[index].nums = Number(val) || 1;
            setSelectedCoupons(newList);
          }}
        />
      ),
    },
    { title: '赠送规则', dataIndex: 'rule' },
    {
      title: '操作',
      render: (_, __, index) => (
        <Button
          type="link"
          danger
          onClick={() => setSelectedCoupons((prev) => prev.filter((_, i) => i !== index))}
        >
          移除
        </Button>
      ),
    },
  ];

  const handleSubmit = async (values: any, isEdit: boolean = false) => {
    // Placeholder for submit logic

    console.log('Submit-values', values);

    const memberCardCouponDTOList = selectedCoupons.map((item) => ({
      couponId: item.couponId, // 只保留必要字段
      nums: item.nums,
      rule: item.rule,
    }));

    const submitData = {
      ...values,
      memberCardCouponDTOList,
    };

    console.log('Submit-data:', submitData);

    if (!values?.id) {
      console.log('add');
      return await addMemberCard(submitData);
    } else {
      console.log('edit');
      return await editMemberCard({ ...submitData, id: value.id });
    }
    // return isEdit ? await updateItem(values) : await createItem(values);
  };

  return (
    <ModalForm
      title={isEdit ? '编辑会员卡' : '添加会员卡'}
      formRef={formRef}
      layout="horizontal"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      modalProps={{
        destroyOnClose: true, // 确保关闭时销毁表单
        onCancel: onCancel,
        bodyStyle: { maxHeight: '80vh', maxWidth: '80vh', overflow: 'auto' },
      }}
      visible={visible}
      onFinish={async (values) => {
        try {
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
              { value: '1', label: '月卡' },
              { value: '2', label: '年卡' },
            ]}
            name="type"
            label="会员卡类型: "
          />
        </Col>
      </Row>
      <Row>
        <Col span={16}>
          <ProFormText
            name="name"
            label="会员卡名称: "
            placeholder="请输入会员卡名称，限20字"
            fieldProps={{
              maxLength: 20,
              showCount: true,
            }}
            rules={[
              { required: true, message: '请输入会员卡名称' },
              { max: 20, message: '会员卡名称不能超过20个字符' },
            ]}
          />
        </Col>
      </Row>

      <Row>
        <Col span={16}>
          <ProFormText
            name="days"
            label="有效期限: "
            initialValue="30" // 新增默认值
            rules={[{ required: true, message: '' }]}
            fieldProps={{
              readOnly: true, // 新增只读属性
              addonAfter: <span style={{ color: '#666' }}>开通当天起计，按自然日30日计算</span>,
              style: {
                backgroundColor: '#f5f5f5', // 可选：添加灰色背景表示不可编辑
                cursor: 'not-allowed', // 可选：修改鼠标样式
              },
            }}
          />
        </Col>
      </Row>

      <Row>
        <Col span={16}>
          <ProFormDigit
            label="会员价格"
            name="price"
            fieldProps={{
              style: { width: '100%' },
            }}
            rules={[
              { required: true, message: '请输入会员价格' },
              { type: 'number', min: 1, message: '门槛金额至少一元' },
              // 这里可以添加自定义验证规则来确保门槛金额不低于面值金额
            ]}
          />
        </Col>
      </Row>
      <Row>
        <Col span={16}>
          <ProFormRadio.Group
            name="status"
            label="开启状态:"
            initialValue={1}
            options={[
              { label: '开启', value: 1 },
              { label: '关闭', value: 0 },
            ]}
          />
          {/* 将提示信息独立出来 */}
          <ProFormDependency name={['status']}>
            {({ status }) => {
              return status === 1 ? (
                <div style={{ color: '#999', marginLeft: '80px', marginTop: 8 }}>
                  开启后，用户端可见
                </div>
              ) : null;
            }}
          </ProFormDependency>
        </Col>
      </Row>

      <Divider orientation="left">会员权益设置</Divider>

      {/* 赠送券模块 */}
      <Row style={{ marginBottom: 16 }}>
        <Col span={24}>
          {selectedCoupons.length > 0 ? (
            <>
              <Table
                columns={selectedColumns}
                dataSource={selectedCoupons}
                rowKey="id"
                pagination={false}
                bordered
              />
              <Button
                type="dashed"
                onClick={() => {
                  setShowCouponModal(true);
                  fetchCoupons({ current: 1, pageSize: 10 }); // 双重保障加载数据
                }}
                style={{ width: '100%', marginTop: 16 }}
              >
                添加券
              </Button>
            </>
          ) : (
            <Button
              type="dashed"
              onClick={() => {
                setShowCouponModal(true);
                fetchCoupons({ current: 1, pageSize: 10 }); // 双重保障加载数据
              }}
              style={{ width: '100%' }}
              block
            >
              添加券
            </Button>
          )}
        </Col>
      </Row>

      {/* 优惠券选择弹窗 */}
      <Modal
        title="选择优惠券"
        width={800}
        visible={showCouponModal}
        onCancel={() => setShowCouponModal(false)}
        footer={null}
      >
        <Table
          columns={columns}
          dataSource={coupons}
          rowKey="id"
          pagination={{
            ...pagination,
            onChange: (page, pageSize) => fetchCoupons({ current: page, pageSize }),
          }}
          scroll={{ y: 400 }}
        />
      </Modal>
    </ModalForm>
  );
};

export default MergeForm;
