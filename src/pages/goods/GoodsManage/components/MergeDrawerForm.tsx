import React, { useRef, useState, useEffect } from 'react';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ProFormRadio } from '@ant-design/pro-form';
import { DrawerForm } from '@ant-design/pro-form';
import { ProFormDigit, ProFormSwitch } from '@ant-design/pro-form';
import ProForm, { ProFormUploadButton } from '@ant-design/pro-form';
import { ProFormMoney, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { ProFieldRequestData, RequestOptionsType } from '@ant-design/pro-utils';
import { listApi } from '@/services/common';
import type { UploadChangeParam } from 'antd/lib/upload';
import type { RcFile, UploadFile } from 'antd/lib/upload/interface';
import { message, Modal } from 'antd';
import { addGoods, editGoods, goodsDetail } from '../service';
import type { SideDishGoods } from '../data';
import PackageTable from './PackageTable';

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

const MergeDrawerForm: React.FC<MergeFormProps> = (props) => {
  const { onCancel, isEdit } = props;

  const [limitBuyState, setLimitBuyState] = useState<boolean>();
  const [fileList, setFileList] = useState<any>([]);
  const [previewState, setPreviewState] = useState<UploadPreviewState>();
  const formRef = useRef<ProFormInstance>();

  const [showPackageStep, setShowPackageStep] = useState<boolean>(false);

  useEffect(() => {
    if (props.modalVisible && props.value) {
      if (props.value.limitBuy) {
        setLimitBuyState(true);
      } else {
        setLimitBuyState(false);
      }
    }
  }, [props.modalVisible, props.value]); // 添加 visible 作为依赖项

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
          sideDishGoods: [],
          belong: undefined, // 确保新增时经营归属没有初始值
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
    const {
      id,
      cid,
      gname,
      content,
      type,
      originalPrice,
      price,
      packageFee,
      limitBuy,
      limitNum,
      status,
      sideDishGoods,
      pepper,
      belong,
    } = formData;
    let { pic } = formData;
    const sideDishIds: { gid: any; relationType: any }[] = [];

    // pic 处理
    if (Array.isArray(pic)) {
      pic = pic?.[0]?.response?.data;
    }

    // 配菜处理
    if (sideDishGoods && Array.isArray(sideDishGoods)) {
      sideDishGoods.forEach((v) => {
        sideDishIds.push({ gid: v?.id, relationType: v?.relationType });
      });
    }

    try {
      let response;
      if (id) {
        // 编辑商品
        const postData = {
          id,
          cid,
          gname,
          content,
          type,
          originalPrice,
          price,
          packageFee,
          limitBuy,
          limitNum,
          status,
          pic,
          sideDishIds,
          pepper,
          belong,
        };
        response = await editGoods(postData);
      } else {
        // 新增商品
        const postData = {
          id,
          cid,
          gname,
          content,
          type,
          originalPrice,
          price,
          packageFee,
          limitBuy,
          limitNum,
          status,
          pic,
          sideDishDTOS: sideDishIds,
          pepper,
          source: 1,
          belong,
        };
        response = await addGoods(postData);
      }

      // 根据返回的响应结果显示不同的提示
      if (response && response.success) {
        message.success('提交成功'); // 只有在成功时才显示提交成功
      } else {
        message.error(response?.msg || '提交失败，请检查数据');
        return false; // 提交失败时终止后续逻辑
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('提交失败，商品归属与其所属类目不匹配');

      return false;
    }

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
          // message.success('提交成功');
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
          <ProForm.Item name="sideDishGoods">
            <PackageTable
              // name="sideDishGoods"
              onRemove={(row: SideDishGoods) => {
                const tableDataSource = formRef.current?.getFieldValue(
                  'sideDishGoods',
                ) as SideDishGoods[];
                console.log(tableDataSource);
                formRef.current?.setFieldsValue({
                  sideDishGoods: tableDataSource.filter((item) => item.id !== row.id),
                });
              }}
              onAdd={(values: any) => {
                const { sideDishGoods, type } = values;
                const tableDataSource = formRef.current?.getFieldValue(
                  'sideDishGoods',
                ) as SideDishGoods[];
                const newDs = (tableDataSource || [])
                  .filter((it) => it.id !== sideDishGoods.id)
                  .concat([{ ...sideDishGoods, relationType: type }]);
                formRef.current?.setFieldsValue({
                  sideDishGoods: newDs,
                });
              }}
            />
          </ProForm.Item>
        )}
        <ProForm.Group>
          <ProFormMoney label="划线价格" name="originalPrice" rules={[{ required: true }]} />
          <ProFormMoney label="单价价格" name="price" rules={[{ required: true }]} />
          <ProFormMoney label="打包费用" name="packageFee" rules={[{ required: true }]} />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormRadio.Group
            name="pepper"
            label="辣度"
            radioType="button"
            initialValue={0}
            options={[
              { label: '不辣', value: 0 },
              { label: '微辣', value: 1 },
              { label: '中辣', value: 2 },
              { label: '爆辣', value: 3 },
            ]}
            rules={[{ required: true }]}
          />
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

        <ProForm.Group>
          <ProFormRadio.Group
            name="belong"
            label="经营归属"
            rules={[{ required: true, message: '请选择经营归属' }]}
            options={[
              { label: '厨房', value: 1 },
              { label: '楼宇', value: 2 },
            ]}
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 22 }}
          />
        </ProForm.Group>
      </DrawerForm>
      <Modal
        // zIndex={9999999}
        visible={previewState?.previewVisible}
        // title={previewTitle}
        footer={null}
        onCancel={handlePreviewCancel}
      >
        <img alt="image" style={{ width: '100%' }} src={previewState?.previewImage} />
      </Modal>
    </>
  );
};

export default MergeDrawerForm;
