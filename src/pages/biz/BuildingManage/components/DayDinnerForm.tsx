import React, { useState, useEffect } from 'react';
import { Form, Input, Table, Drawer, Button, Select, TimePicker } from 'antd';
import { getAreaDayDinnerConfig, updateAreaTimeConfigYxq } from '../service';
import moment from 'moment'; // Ensure you have moment.js installed for handling date-time objects
import { message } from 'antd';
import { set } from 'lodash';

console.log(updateAreaTimeConfigYxq); // 输出应该显示函数代码，而不是undefined

interface DayDinnerFormProps {
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

const pickupOptions = [
  { label: '提货点自提', value: 'FIXED_POS' },
  { label: '送货上门', value: 'TO_ADDR' },
];

const { Option } = Select;

const getMealTypeText = (type: number): string => {
  switch (type) {
    case 0:
      return '早餐';
    case 1:
      return '中餐';
    case 2:
      return '晚餐';
    default:
      return '';
  }
};

const getPickUpTypeText = (pickUpType: string): string => {
  switch (pickUpType) {
    case 'FIXED_POS':
      return '提货点自提';
    default:
      return '送货上门';
  }
};

const getStatusText = (status: boolean): string => {
  switch (status) {
    case false:
      return '关闭';
    case true:
      return '开启';
  }
};

const DayDinnerForm: React.FC<DayDinnerFormProps> = ({ visible, onCancel, value }) => {
  const [form] = Form.useForm();
  const [tableData, setTableData] = useState<TableItem[]>([]);
  const [draftData, setDraftData] = useState([]); // 用于编辑的草稿数据
  const [] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAreaDayDinnerConfig({ id: value.id });
        if (res?.data) {
          const dataWithEditing = res.data.map((item) => ({ ...item, isEditing: false }));
          setTableData(dataWithEditing);
          setDraftData(dataWithEditing); // 初始化草稿数据
        }
      } catch (error) {
        message.error('Failed to fetch data');
      }
    };

    if (visible) {
      fetchData();
    }
  }, [visible]);

  const updateAreaTimeConfig = async (data: never[]) => {
    try {
      console.log(data);
      const res = await updateAreaTimeConfigYxq(data);
      return res.data; // 根据后端的响应调整
    } catch (error) {
      throw error;
    }
  };

  // 触发编辑模式
  const toggleEditing = (id) => {
    const newDraftData = draftData.map((item) => {
      if (item.id === id) {
        return { ...item, isEditing: !item.isEditing };
      }
      return item;
    });
    setDraftData(newDraftData);
  };

  // 更新草稿数据
  const handleSelectChange = (value, id) => {
    const newDraftData = draftData.map((item) => {
      if (item.id === id) {
        return { ...item, pickUpType: value };
      }
      return item;
    });
    setDraftData(newDraftData);
  };

  const handleDraftChange = (recordId, updatedValues) => {
    const newDraftData = draftData.map((item) => {
      if (item.id === recordId) {
        return { ...item, ...updatedValues };
      }
      return item;
    });
    setDraftData(newDraftData);
  };

  // 3: 保存所有更改
  const handleSaveAllChanges = () => {
    // 假设你有一个 API 函数 updateAllData 来处理更新
    updateAreaTimeConfig(draftData)
      .then(() => {
        message.success('所有更改已保存！');
        setTableData(draftData); // 更新原始数据，以反映新的状态
        onCancel(); // 调用onCancel来关闭抽屉
      })
      .catch((error) => {
        message.error('提交更改失败：' + error.message);
      });
  };

  const columns = [
    {
      title: '餐次',
      dataIndex: 'type',
      render: (text: number) => getMealTypeText(text),
    },
    {
      title: '配送方式',
      dataIndex: 'pickUpType',
      render: (_, record) => {
        if (record.isEditing) {
          return (
            <Select
              value={record.pickUpType}
              style={{ width: 120 }}
              onChange={(value) => handleSelectChange(value, record.id)}
            >
              {pickupOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          );
        }
        return getPickUpTypeText(record.pickUpType);
      },
    },
    {
      title: '配送时间',
      dataIndex: 'deliveryTime',
      render: (text, record) => {
        if (record.isEditing) {
          return (
            <TimePicker
              value={moment(text, 'HH:mm')}
              format={'HH:mm'}
              onChange={(time, timeString) =>
                handleDraftChange(record.id, { deliveryTime: timeString })
              }
            />
          );
        }
        return text;
      },
    },
    {
      title: '提货点位置',
      dataIndex: 'pickUpAddress',
      render: (text, record) => {
        if (record.isEditing) {
          return (
            <Input
              defaultValue={text}
              onChange={(e) => handleDraftChange(record.id, { pickUpAddress: e.target.value })}
            />
          );
        }
        return text;
      },
    },
    {
      title: '截单时间',
      dataIndex: 'deadLine',
      render: (text, record) => {
        if (record.isEditing) {
          return (
            <TimePicker
              value={moment(text, 'HH:mm')}
              format={'HH:mm'}
              onChange={(time, timeString) =>
                handleDraftChange(record.id, { deadLine: timeString })
              }
            />
          );
        }
        return text;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text, record) => {
        if (record.isEditing) {
          return (
            <Select
              defaultValue={text ? '开启' : '关闭'}
              style={{ width: 120 }}
              onChange={(value) => handleDraftChange(record.id, { status: value === '开启' })}
            >
              <Option value="开启">开启</Option>
              <Option value="关闭">关闭</Option>
            </Select>
          );
        }
        return getStatusText(text);
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_, record) => (
        <Button onClick={() => toggleEditing(record.id)} type="link">
          {record.isEditing ? '完成编辑' : '编辑'}
        </Button>
      ),
    },
  ];

  return (
    <Drawer
      title="编辑餐次"
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
              dataSource={draftData} // 使用草稿数据作为数据源
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

export default DayDinnerForm;
