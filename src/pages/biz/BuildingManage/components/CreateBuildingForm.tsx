// CreateBuildingForm.tsx
import React from 'react';
import { Modal, Form, Input } from 'antd';

interface CreateBuildingFormProps {
  visible: boolean;
  onCreate: (values: BuildingFormValues) => void;
  onCancel: () => void;
  initialValues?: BuildingFormValues;
}

interface BuildingFormValues {
  addressName: string;
  sort: number;
  id: number;
}

const CreateBuildingForm: React.FC<CreateBuildingFormProps> = ({
  visible,
  onCreate,
  onCancel,
  initialValues,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields(); // 确保在没有初始值时重置表单
      }
    }
  }, [visible, initialValues, form]);

  return (
    <Modal
      title={initialValues ? '编辑楼栋信息' : '新建楼栋信息'}
      visible={visible}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item
          name="addressName"
          label="楼栋名称"
          rules={[{ required: true, message: '请输入楼栋名称!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="sort"
          label="排序"
          rules={[{ required: true, message: '请输入排序数字!' }]}
        >
          <Input type="number" />
        </Form.Item>
        {initialValues && initialValues.id && (
          <Form.Item
            name="id"
            hidden={true} // 隐藏字段
          >
            <Input type="hidden" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default CreateBuildingForm;
