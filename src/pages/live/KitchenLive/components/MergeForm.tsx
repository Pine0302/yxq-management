import React, { useEffect, useRef, useState } from 'react';
import type { FormInstance, ProFormColumnsType } from '@ant-design/pro-form';
import { BetaSchemaForm } from '@ant-design/pro-form';
import { message } from 'antd';
import type { RequestOptionsType } from '@ant-design/pro-utils';
import { kitchenPageInfo } from '../../../biz/KitchenManage/service';
import { addKitchenLive, updateKitchenLive } from '../service';
import { Upload, Modal } from 'antd';
import type { UploadFile, RcFile } from 'antd/lib/upload/interface';
import 'antd/dist/antd.css'; // 确保正确导入antd样式
import 'antd/es/upload/style/index.css';

type MergeFormProps = {
  visible?: boolean;
  onCancel?: () => void;
  isEdit?: boolean;
  value?: any;
  onSuccess?: () => void;
};

type DataItem = {
  id: number;
  name: string;
  phone: string;
  isAdmin: boolean;
  areaId: number;
};

const handleSubmit = async (values: any, isEdit: boolean = false) => {
  if (!isEdit) {
    console.log(values);
    return await addKitchenLive(values);
  } else {
    return await updateKitchenLive(values);
  }
};

const kitchenSelectRequest = async () => {
  const res = await kitchenPageInfo({ current: 1, pageNum: 1, pageSize: 1000 });
  const zh = (res?.data?.list || []).map((v) => {
    return {
      label: v.name,
      value: v.id,
    };
  }) as RequestOptionsType[];

  return zh;
};

const getBase64 = (file: RcFile | undefined) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file as Blob);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const MergeForm: React.FC<MergeFormProps> = (props) => {
  const formRef = useRef<FormInstance<DataItem>>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);

  useEffect(() => {
    if (props?.value) {
      formRef.current?.setFieldsValue(props.value);
      if (props.value.cover) {
        setFileList([
          {
            uid: '-1',
            name: '封面图',
            status: 'done',
            url: props.value.cover,
          },
        ]);
      }
    } else {
      formRef.current?.resetFields();
      setFileList([]);
    }

    return () => {
      setFileList([]);
      setPreviewVisible(false);
      setPreviewImage('');
    };
  }, [props.value]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
  };

  const handleCancel = () => setPreviewVisible(false);

  const handleChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setFileList(newFileList);
  };

  const columns: ProFormColumnsType<DataItem>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      formItemProps: {
        hidden: true,
      },
    },
    {
      title: '直播间名称',
      dataIndex: 'liveName',
      formItemProps: {
        rules: [{ required: true }],
      },
    },
    {
      title: '排序',
      dataIndex: 'sort',
      formItemProps: {
        rules: [{ required: true }],
      },
    },
    {
      title: '所在厨房',
      dataIndex: 'kitchenId',
      valueType: 'select',
      width: '100%',
      request: kitchenSelectRequest,
      formItemProps: {
        rules: [{ required: true }],
      },
    },
    {
      title: '封面图',
      dataIndex: 'cover',
      valueType: 'formItem',
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        return (
          <>
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              beforeUpload={() => false}
            >
              {fileList.length >= 1 ? null : <div>上传图片</div>}
            </Upload>
            <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
              <img alt="封面图" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </>
        );
      },
    },
  ];

  return (
    <>
      <BetaSchemaForm<DataItem>
        title={props?.isEdit ? '编辑厨房直播摄像头' : '新增厨房直播摄像头'}
        formRef={formRef}
        width={500}
        layout="horizontal"
        layoutType="ModalForm"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 22 }}
        onFinish={async (values) => {
          const formData = {
            ...values,
            cover: fileList.length > 0 ? fileList[0].thumbUrl || fileList[0].url : '',
          };
          console.log(formData);
          await handleSubmit(values, props?.isEdit);
          message.success('操作成功');
          props?.onSuccess?.();
          return true;
        }}
        columns={columns}
        visible={props?.visible}
        onVisibleChange={(v) => {
          if (!v) {
            props?.onCancel?.();
          }
        }}
      />
    </>
  );
};

export default MergeForm;
