// CreateBuildingForm.tsx
import React, { useRef, useState, useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ProFormRadio } from '@ant-design/pro-form';
import { DrawerForm } from '@ant-design/pro-form';
import { ProFormDigit, ProFormSwitch } from '@ant-design/pro-form';
import ProForm, { ProFormUploadButton } from '@ant-design/pro-form';
import { ProFormMoney, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';

interface CreateBuildingFormProps {
  visible: boolean;
  onCreate: (values: BuildingFormValues) => void;
  onCancel: () => void;
  initialValues?: BuildingFormValues;
}

interface BuildingFormValues {
  id: number;
  gname: string;
  goodsClass: string;
  areaId: number;
  status: boolean;
  total: number;
  sellnum: number;
  sellout: number;
  originStatus: boolean;
  isEdit: boolean;
  price: number;
  originalPrice: number;
  limitBuy: boolean;
  limitBuyNum: number;
  gid: number;
}

const EditAreaGoodsForm: React.FC<CreateBuildingFormProps> = ({
  visible,
  onCreate,
  onCancel,
  initialValues,
}) => {
  const [limitBuyState, setLimitBuyState] = useState<boolean>();
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
        if (initialValues.limitBuy) {
          setLimitBuyState(true);
        } else {
          setLimitBuyState(false);
        }
      } else {
        form.resetFields(); // 确保在没有初始值时重置表单
      }
    }
  }, [visible, initialValues, form]);

  return (
    <Modal
      title={initialValues ? '商品上架' : '商品上架'}
      visible={visible}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        {/* 商品信息展示部分 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '24px' }}>
          {/* 商品图像 */}
          {initialValues?.pic && (
            <div style={{ flexShrink: 0, marginRight: '16px' }}>
              <img
                src={initialValues.pic}
                alt="商品图像"
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                }}
              />
            </div>
          )}

          {/* 商品信息 */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '16px', fontWeight: 500, marginBottom: '8px' }}>
              {initialValues?.gname || '商品名称'}
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '14px',
                color: '#666',
                alignItems: 'center',
                marginBottom: '0px',
              }}
            >
              <div style={{ marginRight: '16px' }}>{initialValues?.goodsClass || '商品类型'}</div>
              <div>
                参考价：
                <span style={{ color: '#f40' }}>¥{initialValues?.originalPrice || '0.00'}</span>
              </div>
            </div>
          </div>
        </div>
        {/* 分割线 */}
        <hr style={{ border: '1px solid #eee', marginBottom: '24px' }} />
        <ProForm.Group>
          <ProFormMoney label="划线价格" name="originalPrice" rules={[{ required: true }]} />
          <ProFormMoney label="单价价格" name="price" rules={[{ required: true }]} />
          <ProFormMoney label="打包费用" name="packageFee" rules={[{ required: true }]} />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSwitch
            label="是否限购"
            name="limitBuy"
            width="sm"
            fieldProps={{
              onChange: (v) => setLimitBuyState(v),
            }}
          />
          {limitBuyState && (
            <ProFormDigit
              label="限购数量"
              name="limitNum"
              width="sm"
              rules={[{ required: true }]}
            />
          )}
        </ProForm.Group>
        {/* <Input type="number" /> */}
        <Form.Item
          label="上架库存数"
          name="total"
          rules={[
            {
              required: true,
              message: '请填写上架库存数',
            },
          ]}
        >
          <Input type="number" min={0} />
        </Form.Item>
        {initialValues && initialValues.id && (
          <Form.Item
            name="id"
            hidden={true} // 隐藏字段
          >
            <Input type="hidden" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default EditAreaGoodsForm;
