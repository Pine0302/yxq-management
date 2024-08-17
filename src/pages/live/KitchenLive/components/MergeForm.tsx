import React, { useEffect, useRef, useState } from 'react';
import type { FormInstance, ProFormColumnsType } from '@ant-design/pro-form';
import { BetaSchemaForm } from '@ant-design/pro-form';
import { message } from 'antd';
import type { RequestOptionsType } from '@ant-design/pro-utils';
import { kitchenPageInfo } from '../../../biz/KitchenManage/service';
import { addKitchenLive, updateKitchenLive } from '../service';
import { Upload, Modal, Tabs, Radio, Form, Input } from 'antd';
import type { UploadFile, RcFile } from 'antd/lib/upload/interface';
import '../style.less';
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
  pic: string;
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

type TabProps = {
  form: DataItem;
  parentCallback: (data: DataItem) => void;
  sourceKey: 'source1' | 'source2';
  inputKey: 'miniVideoKey' | 'streamName';
};

const Tab: React.FC<TabProps> = ({ form, parentCallback, sourceKey, inputKey }) => {
  const [tabForm, setTabForm] = useState<DataItem>({
    source1: 'val1',
    source2: 'val2',
    miniVideoKey: '',
    streamName: '',
  });

  useEffect(() => {
    if (!form.source1) {
      form.source1 = 'val1';
    }
    if (!form.source2) {
      form.source2 = 'val2';
    }
    setTabForm({
      ...form,
    });
  }, [form]);
  const sendDataToParent = () => {
    parentCallback(tabForm);
  };

  useEffect(() => {
    sendDataToParent();
  }, [tabForm[inputKey]]);

  const handleInputChange = (value: string) => {
    setTabForm((prevTabForm) => ({
      ...prevTabForm,
      [inputKey]: value,
    }));
  };

  return (
    <>
      <div>
        <label className="label-box">直播间来源：</label>
        <Radio.Group disabled value={tabForm[sourceKey]}>
          <Radio value="val1"> 微信视频号直播间 </Radio>
          <Radio value="val2"> 其他直播间 </Radio>
        </Radio.Group>
      </div>
      <div>
        <label className="label-box">
          {inputKey === 'miniVideoKey' ? '微信视频号ID' : '直播参数'}：
        </label>
        <Input
          placeholder={`请输入${inputKey === 'miniVideoKey' ? '微信视频号ID' : '直播参数'}`}
          style={{ width: 200 }}
          value={tabForm[inputKey]}
          onChange={(e) => handleInputChange(e.target.value)}
        />
      </div>
    </>
  );
};
const MergeForm: React.FC<MergeFormProps> = (props) => {
  const formRef = useRef<FormInstance<DataItem>>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [fullForm, setFullForm] = useState<DataItem>({});
  const [childData, setChildData] = useState({});

  const handleCallback = (data) => {
    setChildData({ ...childData, ...data });
  };

  useEffect(() => {
    if (props?.value) {
      formRef.current?.setFieldsValue(props.value);
      //回显
      setFullForm(props.value);

      if (props.value.pic) {
        setFileList([
          {
            uid: '-1',
            name: '封面图',
            status: 'done',
            url: props.value.pic,
          },
        ]);
      }
    } else {
      formRef.current?.resetFields();
      setFileList([]);
      setFullForm({});
    }

    return () => {
      setFileList([]);
      setPreviewVisible(false);
      setPreviewImage('');
      setFullForm({});
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

  const handleChange = ({
    fileList: newFileList,
    file,
  }: {
    fileList: UploadFile[];
    file: UploadFile;
  }) => {
    console.log('File change:', file); // 查看文件的状态和响应
    setFileList(newFileList);

    if (file.status === 'done' && file.response) {
      const imageUrl = file.response.data; // 从响应的data字段获取URL
      console.log('Image uploaded, URL:', imageUrl); // 查看上传的图片URL

      formRef.current?.setFieldsValue({
        pic: imageUrl,
      });

      setFullForm((prevForm) => ({
        ...prevForm,
        pic: imageUrl,
      }));
    }
  };

  const items = [
    {
      key: '1',
      label: 'H5小程序端',
      children: (
        <Tab
          form={fullForm}
          parentCallback={handleCallback}
          sourceKey="source1"
          inputKey="miniVideoKey"
        />
      ),
    },
    {
      key: '2',
      label: 'APP端',
      children: (
        <Tab
          form={fullForm}
          parentCallback={handleCallback}
          sourceKey="source2"
          inputKey="streamName"
        />
      ),
    },
  ];

  const columns: ProFormColumnsType<DataItem>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      formItemProps: {
        hidden: true,
      },
    },
    {
      title: '',
      renderFormItem: () => {
        return <div className="text-title text-bg">基础信息</div>;
      },
      formItemProps: {
        className: 'text-box',
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
      title: '直播间排序',
      dataIndex: 'sort',
      formItemProps: {
        rules: [{ required: true }],
      },
    },
    {
      title: '所属厨房',
      dataIndex: 'kitchenId',
      valueType: 'select',
      width: '100%',
      request: kitchenSelectRequest,
      formItemProps: {
        rules: [{ required: true }],
      },
    },
    {
      title: '默认展示图',
      dataIndex: 'pic',
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        return (
          <>
            <Upload
              action="/file/upload"
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              //beforeUpload={() => false}
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
    {
      title: '',
      renderFormItem: () => {
        return (
          <>
            <div className="text-title text-bg">直播间参数设置</div>
            <Tabs
              type="card"
              items={items.map((item) => {
                return {
                  label: item.label,
                  key: item.key,
                  children: item.children,
                };
              })}
            />
          </>
        );
      },
      formItemProps: {
        className: 'text-box',
      },
    },
  ];

  return (
    <>
      <BetaSchemaForm<DataItem>
        title={props?.isEdit ? '编辑厨房直播摄像头' : '新增厨房直播摄像头'}
        formRef={formRef}
        width={800}
        layout="horizontal"
        layoutType="ModalForm"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 22 }}
        onFinish={async (values) => {
          console.log('Form values before processing:', values);
          const formData = {
            ...values,
            ...childData,
            pic: values.pic || fullForm.pic, // 尝试从当前表单值或完整表单状态获取封面图URL
          };
          console.log('Final form data to submit:', formData);

          await handleSubmit(formData, props?.isEdit);
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
