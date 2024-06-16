import React, { useState, useEffect } from 'react';
import { Form, Table, Drawer, Button, Switch, message } from 'antd';
import { getAreaWeek, updateAreaWeekConfigYxq } from '../service';

interface WeekDinnerFormProps {
  visible: boolean;
  onCancel: () => void;
  value?: {
    id: number;
    type: number;
    deliveryTime: string;
    status: boolean;
    pickUpAddress: string;
    deadLine: string;
    pickUpType: string;
    addressPic: string;
    phone: string | null;
    contacts: string | null;
    pickUpTime: string;
  };
}

interface TableItem {
  id: number;
  type: number;
  deliveryTime: string;
  status: boolean;
  pickUpAddress: string;
  deadLine: string;
  pickUpType: string;
  addressPic: string;
  phone: string | null;
  contacts: string | null;
  pickUpTime: string;
}

const getWeekTypeText = (type: number): string => {
  switch (type) {
    case 0:
      return '星期日';
    case 1:
      return '星期一';
    case 2:
      return '星期二';
    case 3:
      return '星期三';
    case 4:
      return '星期四';
    case 5:
      return '星期五';
    case 6:
      return '星期六';
    default:
      return '';
  }
};

const WeekDinnerForm: React.FC<WeekDinnerFormProps> = ({ visible, onCancel, value }) => {
  const [form] = Form.useForm();
  const [tableData, setTableData] = useState<TableItem[]>([]);
  const [draftData, setDraftData] = useState<TableItem[]>([]); // 使用正确的类型注解

  useEffect(() => {
    if (visible) {
      const fetchData = async () => {
        try {
          const res = await getAreaWeek({ id: value?.id });
          if (res?.data) {
            const dataWithEditing = res.data.map((item: TableItem) => ({
              ...item,
              isEditing: false,
            }));
            setTableData(dataWithEditing);
            setDraftData(dataWithEditing); // 初始化草稿数据
          }
        } catch (error) {
          message.error('Failed to fetch data');
        }
      };
      fetchData();
    }
  }, [visible, value?.id]);

  const handleStatusChange = (checked: boolean, id: number) => {
    const newData = draftData.map((item) => {
      if (item.id === id) {
        return { ...item, status: checked };
      }
      return item;
    });
    setDraftData(newData);
  };

  const handleSaveAllChanges = async () => {
    try {
      const res = await updateAreaWeekConfigYxq(draftData);
      message.success('所有更改已保存！');
      onCancel(); // 调用onCancel来关闭抽屉
      setTableData(draftData);
    } catch (error) {
      message.error('提交更改失败：' + error.message);
    }
  };

  const columns = [
    {
      title: '星期',
      dataIndex: 'day',
      render: (text: number) => getWeekTypeText(text),
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status: boolean, record: TableItem) => (
        <Switch checked={status} onChange={(checked) => handleStatusChange(checked, record.id)} />
      ),
    },
  ];

  return (
    <Drawer
      title="编辑周营业配置"
      visible={visible}
      onClose={onCancel}
      width={1000}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button onClick={handleSaveAllChanges} type="primary">
            保存所有更改
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" initialValues={{ list: tableData }}>
        <Form.List name="list">
          {() => (
            <Table
              dataSource={draftData}
              columns={columns}
              pagination={false}
              rowKey="id"
              bordered
            />
          )}
        </Form.List>
      </Form>
    </Drawer>
  );
};

export default WeekDinnerForm;
