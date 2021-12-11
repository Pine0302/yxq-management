import React, { useRef } from 'react';
import { Modal } from 'antd';
import ProForm, { ProFormInstance, ProFormMoney, ProFormSelect, ProFormText, ProFormTextArea, ProFormUploadButton } from '@ant-design/pro-form';
import { ProFieldRequestData, RequestOptionsType } from '@ant-design/pro-utils';

import commonService from '@/services/common'

type MergeFormProps = {
  modalVisible: boolean;
  isEdit?: boolean;
  onCancel: () => void;
};

const goodsClassRequest: ProFieldRequestData<any> = async (params: any) => {

  const res = await commonService.listApi.goodsClassPageInfo(params);
  const zh = res.data?.list?.map((v) => {
    return {
      label: v.className,
      value: v.id
    }
  }) as RequestOptionsType[];

  return Promise.resolve<RequestOptionsType[]>(zh);
}

const goodsTypeRequest: ProFieldRequestData<any> = async () => {
  const zh: RequestOptionsType[] = [
    { label: '标准套餐', value: 'STANDARD' },
    { label: '规格套餐', value: 'SPECIFICATIONS' },
    { label: '小菜', value: 'SIDE_DISH' },
    { label: '例汤', value: 'SOUP' }, 
    { label: '米饭', value: 'RICE' }, 
  ];

  return Promise.resolve<RequestOptionsType[]>(zh);
};

const MergeForm: React.FC<MergeFormProps> = (props) => {
  const { modalVisible, onCancel } = props;

  const formRef = useRef<ProFormInstance>();

  return (
    <Modal
      destroyOnClose
      title={props?.isEdit ? '编辑商品' : '新增商品'}
      visible={modalVisible}
      closable={true}
      onCancel={() => onCancel()}
      footer={null}
    >
      {/* {props.children} */}

      <ProForm
        layout={'horizontal'}
        formRef={formRef}
        onFinish={async (vals) => {
          console.log(vals);
        }}
      >
        <ProFormSelect
          label="商品类目"
          request={goodsClassRequest}
          name={'cid'}
        />
        <ProFormSelect
          label="商品类型"
          request={goodsTypeRequest}
          name={'type'}
        />
        <ProFormText
          width="md"
          name={'gname'}
          label="商品名称"
        />
        <ProFormTextArea
          label="商品描述"
          name={'content'}
        />
        <ProFormUploadButton
          label="商品图片"
          name={'pic'}
        />
        <ProFormMoney
          label="划线价格"
          name={'originalPrice'}
        />
        <ProFormMoney
          label="单价价格"
          name={'price'}
        />
        <ProFormMoney
          label="打包费"
          name={'packageFee'}
        />

      </ProForm>
    </Modal>
  );
};

export default MergeForm;
