import React, { useRef } from 'react';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm } from '@ant-design/pro-form';
import { ProFormMoney, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { ProFieldRequestData, RequestOptionsType } from '@ant-design/pro-utils';

import { listApi } from '@/services/common';

type MergeFormProps = {
  modalVisible: boolean;
  isEdit: boolean;
  onCancel: () => void;
  value?: any;
};

const goodsClassRequest: ProFieldRequestData<any> = async (params: any) => {
  const res = await listApi.goodsClassPageInfo(params);
  const zh = res.data?.list?.map((v) => {
    return {
      label: v.className,
      value: v.id,
    };
  }) as RequestOptionsType[];

  return Promise.resolve<RequestOptionsType[]>(zh);
};

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
  const { modalVisible, onCancel, value, isEdit } = props;

  const formRef = useRef<ProFormInstance>();

  return (
    <ModalForm
      formRef={formRef}
      title={props?.isEdit ? '编辑商品' : '新增商品'}
      visible={modalVisible}
      onVisibleChange={(v) => {
        //todo 请求数据，设置表单？
        if (v && isEdit) {
          console.log(value);
          formRef.current?.setFieldsValue({ cid: 1 });
          setTimeout(() => {
            formRef.current?.setFieldsValue({
              ...value,
            });
          }, 0);
        } else {
          formRef.current?.setFieldsValue({});
        }
      }}
      layout={'horizontal'}
      size={'middle'}
      modalProps={{
        destroyOnClose: true,
        // 不写这一句，modal窗口没法关闭
        onCancel: () => {
          onCancel();
          // formRef.current?.setFieldsValue({cid: null});
        },
      }}
    >
      {/* {props.children} */}
      <ProFormSelect label="商品类目" request={goodsClassRequest} name={'cid'} />
      <ProFormSelect label="商品类型" request={goodsTypeRequest} name={'type'} />
      <ProFormText width="md" name={'gname'} label="商品名称" />
      <ProFormTextArea label="商品描述" name={'content'} />
      {/* <ProFormUploadButton label="商品图片" name={'pic'} /> */}
      <ProFormMoney label="划线价格" name={'originalPrice'} />
      <ProFormMoney label="单价价格" name={'price'} />
      <ProFormMoney label="打包费" name={'packageFee'} />
    </ModalForm>
  );
};

export default MergeForm;
