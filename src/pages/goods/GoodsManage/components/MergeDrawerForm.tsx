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
import { Button, Table, Input, Space, Typography, Form } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [showPackageStep, setShowPackageStep] = useState<boolean>(false);

  // 在 MergeDrawerForm 组件内部添加以下代码
  const [customAttributes, setCustomAttributes] = useState<any[]>([]);

  const [showCustomAttributes, setShowCustomAttributes] = useState<boolean>(false);

  const [validationErrors, setValidationErrors] = useState({});

  //规格与属性管理状态;
  // const [customAttributes, setCustomAttributes] = useState([
  //   { name: '', values: [''] }, // 初始值：规格名称 + 单个空属性值
  // ]);

  useEffect(() => {
    //编辑
    if (props.modalVisible && props.value) {
      if (props.value.limitBuy) {
        setLimitBuyState(true);
      } else {
        console.log('props.value2:', props.value);
        setLimitBuyState(false);
      }
      if (props.value.goodsAttributeList?.length > 0) {
        const attributes = props.value.goodsAttributeList.map((attr: any) => ({
          name: attr.name || '',
          values: attr.values || [''], // 如果没有值，默认填充一个空字符串
        }));
        setCustomAttributes(attributes);
        console.log('props.value3:', props.value);
      } else {
        // 新增时初始化为空规格
        setCustomAttributes([{ name: '', values: [''] }]);
      }
      setShowCustomAttributes(props.value.belong === 2);
    } else {
      //新增
    }
  }, [props.modalVisible, props.value]); // 添加 visible 作为依赖项

  const handleBelongChange = (value: number) => {
    setShowCustomAttributes(value === 2);
  };

  const drawerVisiableChangeHandle = async (visiable: boolean) => {
    if (visiable) {
      if (isEdit) {
        const { data } = await goodsDetail({ id: props.value.id });
        formRef.current?.setFieldsValue(data);
        setShowPackageStep(data?.type === 'SPECIFICATIONS');
        setShowCustomAttributes(data?.belong === 2);
        // 处理图片展示
        setFileList([
          {
            uid: data?.pic,
            name: data?.pic,
            status: 'done',
            url: `https://img.hzex7.com${data?.pic}`,
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
          sort: 0,
          status: false,
          sideDishGoods: [],
          belong: undefined, // 确保新增时经营归属没有初始值
        });
        setShowPackageStep(false);
        setShowCustomAttributes(false);
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

  const canAddNewAttribute = () => {
    const existingNames = customAttributes.map((attr) => attr.name.trim().toLowerCase());
    const namesSet = new Set(existingNames); // 使用 Set 来检查重复项，Set 自动排除重复值

    // 检查是否所有名称都已填写且没有重复
    if (existingNames.length !== namesSet.size || existingNames.includes('')) {
      message.error('属性名称不能为空或重复！');
      return false;
    }

    return true;
  };

  const checkDuplicateValues = (index) => {
    const attribute = customAttributes[index];
    const valuesSet = new Set(attribute.values.map((value) => value.trim().toLowerCase()));
    if (attribute.values.length !== valuesSet.size) {
      message.error('同一个属性下的规格值不能重复！');
      return false; // 存在重复
    }
    return true; // 无重复
  };

  const mergeSubmit = async (formData: any) => {
    if (Object.keys(validationErrors).length > 0) {
      message.error('请填写所有必填的规格和规格值！');
      return false;
    }

    for (let attribute of customAttributes) {
      const valuesSet = new Set(attribute.values.map((value) => value.trim().toLowerCase()));
      if (attribute.values.length !== valuesSet.size) {
        message.error('同一个属性下的规格值不能重复！');
        return false; // 存在重复，终止提交
      }
    }

    setIsSubmitting(true); // 提交前禁用按钮

    // 处理规格和属性数据
    const formattedCustomAttributes = customAttributes.map((spec) => ({
      name: spec.name,
      values: spec.values.filter((value) => value.trim() !== ''), // 移除空值
    }));
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
      sort,
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
          sort,
          goodsAttributes: formattedCustomAttributes, // 将处理后的规格数据添加到提交数据
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
          sort,
          goodsAttributes: formattedCustomAttributes, // 将处理后的规格数据添加到提交数据
        };
        response = await addGoods(postData);
      }

      // 根据返回的响应结果显示不同的提示
      if (response && response.success) {
        message.success('提交成功'); // 只有在成功时才显示提交成功
        setIsSubmitting(false);
      } else {
        message.error(response?.msg || '提交失败，请检查数据');
        setIsSubmitting(false);
        return false; // 提交失败时终止后续逻辑
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('提交失败，商品归属与其所属类目不匹配');
      setIsSubmitting(false);
      return false;
    }

    onCancel();
    return true;
  };

  // 处理输入变化
  // const handleInputChange = (value: string, key: string, index: number) => {
  //   const newAttributes = [...customAttributes];
  //   newAttributes[index][key] = value;
  //   setCustomAttributes(newAttributes);
  // };
  const validateInput = (attributes) => {
    const newErrors = {};
    attributes.forEach((attr, index) => {
      const errors = [];
      if (!attr.name.trim()) {
        errors.push('name');
      }
      attr.values.forEach((value, vIndex) => {
        if (!value.trim()) {
          errors.push(`value-${vIndex}`);
        }
      });
      if (errors.length > 0) {
        newErrors[index] = errors;
      }
    });
    setValidationErrors(newErrors);
  };

  // 处理输入变化
  const handleInputChange = (value: string, key: string, index: number, valueIndex?: number) => {
    const newAttributes = [...customAttributes];
    if (key === 'name') {
      // 更新规格名称
      newAttributes[index].name = value;
      console.log('valueIndex34:', valueIndex);
    } else if (key === 'values' && valueIndex !== undefined) {
      // 更新某个规格的属性值
      newAttributes[index].values[valueIndex] = value;
      console.log('valueIndex35:', valueIndex);
    }
    setCustomAttributes(newAttributes);
    validateInput(newAttributes);
    console.log('valueIndex36:', newAttributes);
  };

  const handleBlur = (value: string, key: string, index: number) => {
    // 仅在失去焦点时更新状态
    handleInputChange(value, key, index);
  };

  // 添加新规格行
  const handleAddAttribute = () => {
    if (customAttributes.length > 0 && !canAddNewAttribute()) {
      return;
    }
    const newAttributes = [...customAttributes, { name: '', values: [''] }];
    setCustomAttributes(newAttributes);
    validateInput(newAttributes); // 确保新添加的规格也进行校验
  };

  // 添加属性值
  const handleAddAttributeValue = (specIndex: number) => {
    const newAttributes = [...customAttributes];
    newAttributes[specIndex].values.push(''); // 添加一个空的属性值
    if (!checkDuplicateValues(specIndex)) {
      return; // 如果检查到重复，则不进行添加
    }
    setCustomAttributes(newAttributes);
    validateInput(newAttributes); // 确保新添加的规格值也进行校验
  };

  // 删除规格或属性值
  const handleRemoveAttribute = (index: number, valueIndex?: number) => {
    const newAttributes = [...customAttributes];
    if (valueIndex !== undefined) {
      // 删除单个属性值
      newAttributes[index].values.splice(valueIndex, 1);
    } else {
      // 删除整个规格
      newAttributes.splice(index, 1);
    }
    setCustomAttributes(newAttributes);
  };

  // // 添加新行
  // const handleAddAttribute = () => {
  //   setCustomAttributes([...customAttributes, { name: '', value: '' }]);
  // };

  // 删除行
  // const handleRemoveAttribute = (index: number) => {
  //   const newAttributes = [...customAttributes];
  //   newAttributes.splice(index, 1);
  //   setCustomAttributes(newAttributes);
  // };

  return (
    <>
      <DrawerForm
        formRef={formRef}
        title={props?.isEdit ? '编辑商品' : '新增商品'}
        visible={props.modalVisible}
        onVisibleChange={drawerVisiableChangeHandle}
        layout="horizontal"
        width={999}
        submitter={{
          submitButtonProps: {
            disabled: isSubmitting, // 根据状态控制按钮是否禁用
          },
        }}
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
          <ProFormMoney label="划线价格" name="originalPrice" initialValue={99} />
          <ProFormMoney label="单价价格" name="price" initialValue={99} />
          <ProFormMoney label="打包费用" name="packageFee" initialValue={99} />
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
          <ProFormDigit label="排序号" name="sort" initialValue={0} />
        </ProForm.Group>

        <ProForm.Group>
          <ProFormSwitch
            label="是否限购"
            name="limitBuy"
            width="sm"
            initialValue={false}
            hidden
            fieldProps={{
              onChange: (v) => setLimitBuyState(v),
            }}
          />
          {limitBuyState && (
            <ProFormDigit
              label="限购数量"
              name="limitNum"
              width="sm"
              hidden
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
            onChange={(e) => handleBelongChange(e.target.value)}
          />
        </ProForm.Group>

        {/* 自定义属性 */}
        {/* 规格管理表格 */}

        {showCustomAttributes && (
          <>
            <Form.Item label="自定义规格属性：" colon={false}>
              {/* 无需输入或选择元素，仅显示标签 */}
            </Form.Item>
            <Table
              dataSource={customAttributes}
              columns={[
                {
                  title: '属性名称',
                  dataIndex: 'name',
                  render: (_: any, record: any, index: number) => (
                    <Input
                      placeholder="请输入属性名称"
                      defaultValue={record.name}
                      //onChange={(e) => handleInputChange(e.target.value, 'name', index, 0)}
                      onBlur={(e) => handleBlur(e.target.value, 'name', index)}
                      style={{
                        borderColor: validationErrors[index]?.includes('name') ? 'red' : undefined,
                      }}
                    />
                  ),
                },
                {
                  title: '选项',
                  dataIndex: 'values',
                  render: (_: any, record: any, index: number) => (
                    <>
                      {record.values.map((value: string, valueIndex: number) => (
                        <Space key={valueIndex} style={{ marginBottom: 8 }}>
                          <Input
                            placeholder="请输入请输入规格选项值"
                            value={value}
                            onChange={(e) =>
                              handleInputChange(e.target.value, 'values', index, valueIndex)
                            }
                            style={{
                              borderColor: validationErrors[index]?.includes(`value-${valueIndex}`)
                                ? 'red'
                                : undefined,
                            }}
                          />
                          <Button
                            type="link"
                            icon={<MinusCircleOutlined />}
                            onClick={() => handleRemoveAttribute(index, valueIndex)}
                            danger
                          />
                        </Space>
                      ))}
                      <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={() => handleAddAttributeValue(index)}
                      >
                        添加规格选项值
                      </Button>
                    </>
                  ),
                },
                {
                  title: '操作',
                  render: (_: any, record: any, index: number) => (
                    <Button
                      type="link"
                      icon={<MinusCircleOutlined />}
                      onClick={() => handleRemoveAttribute(index)}
                      danger
                    >
                      删除
                    </Button>
                  ),
                },
              ]}
              rowKey="name"
              pagination={false}
            />
            <Button type="dashed" onClick={handleAddAttribute} block>
              添加属性
            </Button>
          </>
        )}
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
