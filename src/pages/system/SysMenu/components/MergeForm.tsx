import React, { useEffect, useRef, useState } from 'react';
import type { FormInstance, ProFormColumnsType } from '@ant-design/pro-form';
import { BetaSchemaForm, ProFormRadio } from '@ant-design/pro-form';
import { message, Radio, Input, Select, TreeSelect } from 'antd';
import { addSystemMenu, updateSystemMenu } from '../service';
import type { UploadFile } from 'antd/lib/upload/interface';
import type { ActionType } from '@ant-design/pro-table';
import 'antd/dist/antd.css'; // 确保正确导入antd样式
import 'antd/es/upload/style/index.css';
import request from 'umi-request';

type MergeFormProps = {
  visible?: boolean;
  onCancel?: () => void;
  isEdit?: boolean;
  viewMode?: boolean; // 新增属性，用于查看模式
  value?: any;
  onSuccess?: () => void;
};

type DataItem = {
  menuId: number;
  name: string;
  application: string;
  type: number;
  path: string;
  component: string;
  icon: string;
  title: string;
  hidden: boolean;
  pid: number;
  menuSort: number;
  buttonType: string;
  remark: string;
};

const handleSubmit = async (values: any, isEdit: boolean = false) => {
  console.log('values', values);
  console.log('isEdit', isEdit);
  if (!isEdit) {
    return await addSystemMenu(values);
  } else {
    console.log('Updating menu...');
    console.log('values', values);
    if (values.pid === values.menuId) {
      message.error('请重新设置设置当前节点的父节点');
      return null;
    }
    return await updateSystemMenu(values);
  }
};

const buttonTypes = [
  { label: '添加', value: 'add' },
  { label: '编辑', value: 'edit' },
  { label: '删除', value: 'delete' },
  { label: '详情', value: 'detail' },
];

const MergeForm: React.FC<MergeFormProps> = (props) => {
  const formRef = useRef<FormInstance<DataItem>>();
  const actionRef = useRef<ActionType>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [menuTreeData, setMenuTreeData] = useState([]);
  const [showPathInput, setShowPathInput] = useState(true);

  // 递归转换后端数据到 TreeSelect 需要的格式
  const transformMenuData = (menuData) => {
    return menuData.map((item) => ({
      title: item.title,
      value: item.menuId,
      // 递归处理子菜单，确保当 children 为 null 时转换为空数组
      children: item.children ? transformMenuData(item.children) : [],
    }));
  };

  useEffect(() => {
    if (props?.value) {
      console.log('Setting initial values...');
      formRef.current?.setFieldsValue(props.value);
      const typeValue = props.value.type;
      setShowPathInput(typeValue !== 3);
      console.log(typeValue);
      console.log(showPathInput);
      console.log('Setting initial values done...');
    } else {
      formRef.current?.resetFields();
      setFileList([]);
    }
  }, [props.value]); // 仅当 props.value 变化时运行这部分代码

  useEffect(() => {
    if (formRef.current) {
      console.log('Form is initialized.');
    } else {
      console.log('Form is not initialized.');
    }
  }, []);

  useEffect(() => {
    // Fetch menu tree data
    const fetchMenuTree = async () => {
      try {
        const result = await request('/adminapi/system/menu/list', {
          method: 'GET', // 确保方法与后端接口一致
        });
        if (result && result.data) {
          const formattedData = transformMenuData(result.data); // 转换数据
          setMenuTreeData(formattedData);
        }
      } catch (error) {
        message.error('获取菜单树数据失败: ' + error.message);
      }
    };

    fetchMenuTree();

    return () => {
      setFileList([]); // 可能不需要在这里，除非API调用与fileList有关
    };
  }, []); // 无依赖，仅在组件挂载时执行

  const columns: ProFormColumnsType<DataItem>[] = [
    {
      title: 'id',
      dataIndex: 'menuId',
      formItemProps: {
        hidden: true,
      },
    },
    {
      title: '所属应用',
      dataIndex: 'application',
      renderFormItem: (item, { defaultRender }) => {
        return (
          <Input
            {...item}
            value="一鲜七管理后台系统" // 设置默认值
            disabled={true} // 设置输入框不可更改
            placeholder="请输入角色名称"
          />
        );
      },
      formItemProps: {
        rules: [{ required: false }],
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      valueType: 'radio',
      renderFormItem: (item, config, form) => {
        // 尝试从 config 中访问 form 对象
        // 根据你使用的 ProForm 版本，你可能需要调整这里的访问方式
        // 以下是一种可能的方法，直接从 form 参数访问，需要确认你的 ProForm 版本是否支持
        const formInstance: FormInstance<DataItem> | undefined = form as FormInstance<DataItem>;
        if (!formInstance) {
          console.error('Form instance is undefined.');
          return null;
        }
        return (
          <ProFormRadio.Group
            fieldProps={{
              options: [
                { label: '目录', value: '1' },
                { label: '菜单', value: '2' },
                { label: '按钮', value: '3' },
              ],
              value: formInstance.getFieldValue('type')
                ? formInstance.getFieldValue('type').toString()
                : '1', // 默认值为 '1'，并确保为字符串
              onChange: (e) => {
                const selectedValue = e.target.value;
                setShowPathInput(selectedValue !== '3');
                formInstance.setFieldsValue({ type: selectedValue });
              },
            }}
          />
        );
      },
    },
    {
      title: '名称',
      dataIndex: 'title',
      renderFormItem: (item, { defaultRender }) => {
        return (
          <Input
            {...item}
            disabled={props.viewMode}
            placeholder="请输入名称（建议5字内，最多12字）"
            maxLength={12} // 限制最大输入长度为12个字符
          />
        );
      },
      formItemProps: {
        rules: [
          { required: true, message: '请输入名称' },
          { max: 12, message: '名称最多12字' }, // 添加规则以显示错误消息，当输入超过12个字时
        ],
      },
    },
    {
      title: '编号',
      dataIndex: 'name',
      renderFormItem: (item, { defaultRender }) => {
        return (
          <Input
            {...item}
            disabled={props.viewMode}
            placeholder="比如，menu_add（最多20字）"
            maxLength={20}
          />
        );
      },
      formItemProps: {
        rules: [
          { required: true, message: '请输入编号' },
          { max: 20, message: '编号最多20字' },
        ],
      },
    },
    {
      title: '图标地址',
      dataIndex: 'icon',
      renderFormItem: (item, { defaultRender }) => {
        return (
          <Input
            {...item}
            disabled={props.viewMode}
            placeholder="比如，menu-sys，外网地址的输入url即可）"
          />
        );
      },
      formItemProps: {
        rules: [{ required: false }],
      },
    },
    {
      title: '路由地址',
      dataIndex: 'path',
      renderFormItem: (item, { defaultRender }) => {
        return showPathInput ? <Input {...item} placeholder="比如，/sys/menu/modifyMenu" /> : null;
      },
      formItemProps: {
        hidden: !showPathInput, // Hide this field based on `showPathInput` state
        rules: [{ required: true, message: '请输入路由地址' }],
      },
    },
    {
      title: '按钮类型',
      dataIndex: 'buttonType',
      valueType: 'select',
      renderFormItem: (item, config, form) => {
        const formInstance: FormInstance<DataItem> | undefined = form as FormInstance<DataItem>;
        if (!formInstance) {
          console.error('Form instance is undefined.');
          return null;
        }
        // 获取 form 对象
        //if (!form) return null; // 确保 form 对象存在

        return !showPathInput ? (
          <Select
            options={buttonTypes}
            value={formInstance.getFieldValue('buttonType')} // 确保获取当前字段的值
            onChange={(value) => {
              formInstance.setFieldsValue({ buttonType: value });
              if (!formInstance.isFieldTouched('buttonType')) {
                formInstance.resetFields(['buttonType']);
              }
            }}
            placeholder="请选择按钮类型"
          />
        ) : null;
      },
      formItemProps: {
        rules: [{ required: showPathInput, message: '请选择按钮类型' }],
      },
      hideInForm: showPathInput,
    },
    {
      title: '可见性',
      dataIndex: 'hidden',
      renderFormItem: (item, { defaultRender }) => {
        return (
          <Radio.Group {...item} value={formRef.current?.getFieldValue('hidden')}>
            <Radio value={false}>可见</Radio>
            <Radio value={true}>不可见</Radio>
          </Radio.Group>
        );
      },
      formItemProps: {
        rules: [{ required: true, message: '请选择是否可见' }],
      },
    },
    {
      title: '父级',
      dataIndex: 'pid',
      renderFormItem: (item, { defaultRender }) => {
        return (
          <TreeSelect
            {...item}
            treeData={menuTreeData}
            placeholder="请选择父级菜单"
            treeDefaultExpandAll
            onChange={(value) => {
              // 使用 formRef 来设置表单值
              formRef.current?.setFieldsValue({ pid: value });
            }}
          />
        );
      },
      formItemProps: {
        rules: [{ required: false }],
      },
    },

    {
      title: '排序号',
      dataIndex: 'menuSort',
      renderFormItem: (item, { defaultRender }) => {
        return (
          <Input
            {...item}
            disabled={props.viewMode}
            placeholder="数值越小越靠前，建议以10为间隔，方便调整"
          />
        );
      },
      formItemProps: {
        rules: [{ required: true, message: '请输入排序号' }],
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      renderFormItem: (item, { defaultRender }) => {
        return <Input {...item} disabled={props.viewMode} placeholder="备注" />;
      },
      formItemProps: {
        rules: [{ required: false }],
      },
    },
  ];

  return (
    <>
      <BetaSchemaForm<DataItem>
        //title={props?.isEdit ? '编辑角色' : '新增角色'}
        title={props?.viewMode ? '查看菜单' : props?.isEdit ? '编辑菜单' : '新增菜单'}
        formRef={formRef}
        initialValues={{ type: '1' }} // 可以设置一个默认值，确保初始渲染时有值
        width={500}
        layout="horizontal"
        layoutType="ModalForm"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 22 }}
        onFinish={async (values) => {
          if (props?.viewMode) {
            return true; // 在查看模式下，不执行提交
          }
          try {
            const formData = {
              ...values,
              cover: fileList.length > 0 ? fileList[0].thumbUrl || fileList[0].url : '',
            };
            console.log(formData);
            await handleSubmit(values, props?.isEdit);
            message.success('操作成功');
            props?.onSuccess?.();
            return true;
          } catch (error) {
            if (error instanceof Error) {
              console.table(error);
              message.error(`操作失败: ${error.data.msg}`);
            } else {
              message.error('操作失败');
            }
            return false;
          }
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
