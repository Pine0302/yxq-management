import React, { useRef, useState } from 'react';
import type { ProFormInstance } from '@ant-design/pro-form';
import { DrawerForm } from '@ant-design/pro-form';
import { ProFormDigit, ProFormSwitch } from '@ant-design/pro-form';
import ProForm, { ProFormUploadButton } from '@ant-design/pro-form';
import { ProFormMoney, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { ProFieldRequestData, RequestOptionsType } from '@ant-design/pro-utils';

import { listApi } from '@/services/common';
import type { UploadChangeParam } from 'antd/lib/upload';
import type { RcFile, UploadFile } from 'antd/lib/upload/interface';
import { message, Modal } from 'antd';
import { goodsDetail } from '../service';
import type { SideDishGoods } from '../data';
import PackageTable from './PackageTable';

type MergeFormProps = {
  modalVisible: boolean;
  isEdit: boolean;
  onCancel: () => void;
  value?: any;
  // showPackageStep?: boolean;
  // onGoodsTypeSelected?: () => void;
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

const MergeDrawerForm: React.FC<MergeFormProps> = (props) => {
  const { onCancel, isEdit } = props;

  const [limitBuyState, setLimitBuyState] = useState<boolean>();
  const [fileList, setFileList] = useState<any>([]);
  const [previewState, setPreviewState] = useState<UploadPreviewState>();
  const formRef = useRef<ProFormInstance>();
  // const actionRef = useRef<ActionType>();

  const [showPackageStep, setShowPackageStep] = useState<boolean>(false);
  // const [ds, setDs] = useState<SideDishGoods[]>([]);

  const drawerVisiableChangeHandle = async (visiable: boolean) => {
    if (visiable) {
      if (isEdit) {
        const { data } = await goodsDetail({ id: props.value.id });
        formRef.current?.setFieldsValue(data);
        setShowPackageStep(data?.type === 'SPECIFICATIONS');
        // 处理图片展示
        setFileList([
          {
            uid: data?.pic,
            name: data?.pic,
            status: 'done',
            url: `https://img.nidcai.com${data?.pic}`,
          },
        ]);
      } else {
        formRef.current?.setFieldsValue({
          id: null,
          cid: null,
          type: null,
          gname: null,
          content: null,
          pic: null,
          originalPrice: null,
          price: null,
          packageFee: null,
          limitBuy: false,
          limitNum: 0,
          status: false,
        });
        setShowPackageStep(false);
        setFileList([]);
      }
    } else {
      onCancel();
    }
  };

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
      <DrawerForm
        formRef={formRef}
        title={props?.isEdit ? '编辑商品' : '新增商品'}
        visible={props.modalVisible}
        onVisibleChange={drawerVisiableChangeHandle}
        layout="horizontal"
        width={999}
        onFinish={async (values) => {
          mergeSubmit(values);
          message.success('提交成功');
        }}
      >
        <ProFormText name="id" hidden />
        <ProForm.Group>
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
            fieldProps={{
              onChange: (v) => {
                setShowPackageStep(v === 'SPECIFICATIONS');
              },
            }}
          />
          <ProFormText label="商品名称" name="gname" rules={[{ required: true }]} />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormTextArea
            label="商品描述"
            name="content"
            rules={[{ required: true }]}
            width="md"
          />
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
            width="md"
          />
        </ProForm.Group>
        {showPackageStep && (
          <PackageTable
            name="sideDishGoods"
            onRemove={(row: SideDishGoods) => {
              const tableDataSource = formRef.current?.getFieldValue(
                'sideDishGoods',
              ) as SideDishGoods[];
              formRef.current?.setFieldsValue({
                sideDishGoods: tableDataSource.filter((item) => item.id !== row.id),
              });
            }}
            onChange={(ds: SideDishGoods[]) => {
              console.log(ds);
            }}
          />
        )}
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
        <ProFormSwitch label="是否上架" name="status" />
      </DrawerForm>
      <Modal
        // zIndex={9999999}
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

export default MergeDrawerForm;
