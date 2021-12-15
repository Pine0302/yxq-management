import React, { useRef, useState } from 'react';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ProFormUploadButton } from '@ant-design/pro-form';
import { ModalForm } from '@ant-design/pro-form';
import { ProFormMoney, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { ProFieldRequestData, RequestOptionsType } from '@ant-design/pro-utils';

import { listApi } from '@/services/common';
import type { UploadChangeParam } from 'antd/lib/upload';
import type { RcFile, UploadFile } from 'antd/lib/upload/interface';
import { Modal } from 'antd';

type MergeFormProps = {
  modalVisible: boolean;
  isEdit: boolean;
  onCancel: () => void;
  value?: any;
};

type UploadPreviewState = {
  previewImage: string | undefined;
  previewVisible: boolean;
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

const getBase64 = (file: RcFile | undefined) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file as Blob);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const MergeForm: React.FC<MergeFormProps> = (props) => {
  const { onCancel, value, isEdit } = props;

  const [fileList, setFileList] = useState<any>([]);
  const [previewState, setPreviewState] = useState<UploadPreviewState>();
  const formRef = useRef<ProFormInstance>();

  const uploadOnChange = (info: UploadChangeParam<UploadFile<any>>) => {
    setFileList([...info.fileList]);
    console.log('onChange', info);
  };

  const handlePreviewCancel = () =>
    setPreviewState({ ...previewState, previewVisible: false } as UploadPreviewState);

  const handlePreview = async (file: UploadFile<any>) => {
    if (!file.url && !file.preview) {
      file.preview = (await getBase64(file.originFileObj)) as string;
    }

    setPreviewState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });

    // this.setState({
    //   previewImage: file.url || file.preview,
    //   previewVisible: true,
    //   previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    // });
  };

  return (
    <ModalForm
      formRef={formRef}
      title={props?.isEdit ? '编辑商品' : '新增商品'}
      visible={props.modalVisible}
      onVisibleChange={(visible) => {
        //todo 请求数据，设置表单？
        if (visible && isEdit) {
          console.log(value);
          // formRef.current?.setFieldsValue({ cid: 1 });
          setTimeout(() => {
            formRef.current?.setFieldsValue({
              ...value,
              // pic: `http://img.nidcai.com${value.pic}`,
            });
          }, 0);
          setFileList([
            {
              uid: props?.value?.pic,
              name: props?.value?.pic,
              status: 'done',
              url: `https://img.nidcai.com${props?.value?.pic}`,
            },
          ]);
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
          setFileList([]);
          // formRef.current?.setFieldsValue({cid: null});
        },
      }}
      onFinish={async (v) => {
        console.log(v);
        onCancel();
        return true;
      }}
    >
      {/* {props.children} */}
      <ProFormText name="id" hidden />
      <ProFormSelect label="商品类目" request={goodsClassRequest} name={'cid'} />
      <ProFormSelect label="商品类型" request={goodsTypeRequest} name={'type'} />
      <ProFormText label="商品名称" name={'gname'} />
      <ProFormTextArea label="商品描述" name={'content'} />
      <ProFormUploadButton
        label="商品图片"
        name="pic"
        accept=".png,.jpg"
        fieldProps={{
          name: 'file',
          onPreview: handlePreview,
        }}
        action="/file/upload"
        fileList={fileList}
        listType="picture-card"
        onChange={uploadOnChange}
        max={1}
      />
      <ProFormMoney label="划线价格" name={'originalPrice'} />
      <ProFormMoney label="单价价格" name={'price'} />
      <ProFormMoney label="打包费" name={'packageFee'} />

      <Modal
        visible={previewState?.previewVisible}
        // title={previewTitle}
        footer={null}
        onCancel={handlePreviewCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={previewState?.previewImage} />
      </Modal>
    </ModalForm>
  );
};

export default MergeForm;
