import React, { useEffect, useRef, useState } from 'react';
import type { ProFormInstance } from '@ant-design/pro-form';
import { StepsForm } from '@ant-design/pro-form';
import { ProFormDigit, ProFormSwitch } from '@ant-design/pro-form';
import ProForm, { ProFormUploadButton } from '@ant-design/pro-form';
import { ProFormMoney, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { ProFieldRequestData, RequestOptionsType } from '@ant-design/pro-utils';

import { listApi } from '@/services/common';
import type { UploadChangeParam } from 'antd/lib/upload';
import type { RcFile, UploadFile } from 'antd/lib/upload/interface';
import { FormInstance, message, Modal } from 'antd';

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

const MergeStepForm: React.FC<MergeFormProps> = (props) => {
  const { onCancel, value, isEdit } = props;

  const [limitBuyState, setLimitBuyState] = useState<boolean>();
  const [fileList, setFileList] = useState<any>([]);
  const [previewState, setPreviewState] = useState<UploadPreviewState>();
  const formRef = useRef<FormInstance>();
  const step1FormRef = useRef<ProFormInstance>();
  const step2FormRef = useRef<ProFormInstance>();
  const step3FormRef = useRef<ProFormInstance>();

  const formMapRef = useRef<React.MutableRefObject<ProFormInstance<any> | undefined>[]>([]);

  useEffect(() => {
    if (props.modalVisible && isEdit) {
      console.log(value);

      setTimeout(() => {
        formMapRef.current.forEach((formInstanceRef) => {
          formInstanceRef.current?.setFieldsValue(value);
        });
      }, 0);

      // 处理图片展示
      setFileList([
        {
          uid: props?.value?.pic,
          name: props?.value?.pic,
          status: 'done',
          url: `https://img.nidcai.com${props?.value?.pic}`,
        },
      ]);
    } else {
      setTimeout(() => {
        formMapRef.current.forEach((formInstanceRef) => {
          formInstanceRef.current?.setFieldsValue({});
        });
      }, 0);
      setFileList([]);
    }
  }, [props.modalVisible]);

  const uploadChangeHandle = (info: UploadChangeParam<UploadFile<any>>) => {
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
  };

  const mergeSubmit = async (formData: any) => {
    console.log(formData);
    onCancel();
    return true;
  };

  return (
    <>
      <StepsForm
        formMapRef={formMapRef}
        formRef={formRef}
        onFinish={async (values) => {
          // console.log(values);
          mergeSubmit(values);
          message.success('提交成功');
        }}
        formProps={{
          validateMessages: {
            required: '此项为必填项',
          },
        }}
        stepsFormRender={(dom, submitter) => {
          return (
            <Modal
              title={props?.isEdit ? '编辑商品' : '新增商品'}
              width={800}
              onCancel={() => onCancel()}
              visible={props.modalVisible}
              footer={submitter}
              destroyOnClose
            >
              {dom}
            </Modal>
          );
        }}
      >
        <StepsForm.StepForm
          formRef={step1FormRef}
          // name="base"
          title="基础信息"
          layout="horizontal"
          onFinish={async () => {
            // await waitTime(2000);
            return true;
          }}
        >
          <ProFormText name="id" hidden />
          <ProFormSelect
            label="商品类目"
            request={goodsClassRequest}
            name="cid"
            rules={[{ required: true }]}
          />
          <ProFormSelect
            label="商品类型"
            request={goodsTypeRequest}
            name="type"
            rules={[{ required: true }]}
          />
          <ProFormText label="商品名称" name="gname" rules={[{ required: true }]} />
          <ProFormTextArea label="商品描述" name="content" rules={[{ required: true }]} />
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
            onChange={uploadChangeHandle}
            max={1}
            rules={[{ required: true }]}
          />
        </StepsForm.StepForm>
        <StepsForm.StepForm
          formRef={step2FormRef}
          name="checkbox"
          title="套餐信息"
          layout="horizontal"
        >
          <ProFormText label="商品名称" name="gname" />
        </StepsForm.StepForm>
        <StepsForm.StepForm formRef={step3FormRef} name="time" title="其他信息" layout="horizontal">
          <ProFormMoney label="划线价格" name="originalPrice" />
          <ProFormMoney label="单价价格" name="price" />
          <ProFormMoney label="打包费用" name="packageFee" />
          <ProForm.Group>
            <ProFormSwitch
              label="是否限购"
              name="limitBuy"
              width="sm"
              fieldProps={{
                onChange: (v) => setLimitBuyState(v),
              }}
            />
            {limitBuyState && <ProFormDigit label="限购数量" name="limitNum" width="sm" />}
          </ProForm.Group>
          <ProFormSwitch label="是否上架" name="status" />
        </StepsForm.StepForm>
      </StepsForm>
      <Modal
        visible={previewState?.previewVisible}
        // title={previewTitle}
        footer={null}
        onCancel={handlePreviewCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={previewState?.previewImage} />
      </Modal>
    </>
  );
};

export default MergeStepForm;
