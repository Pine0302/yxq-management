import React, { useState, useEffect } from 'react';
import { Form, Table, Drawer, Button, InputNumber, Switch, Select, message, Modal } from 'antd';

import { getAreaAct, updateAreaActYxq, getDishesByActId, getAllDishes } from '../service';

interface AreaActFormProps {
  visible: boolean;
  onCancel: () => void;
  value?: {
    id: number;
    advanceStart: number;
    advanceEnd: number;
    discount: GLfloat;
    status: boolean;
    gids: string;
    deliveryFee: GLfloat;
    delayTime: number;
    appDeliveryFee: GLfloat;
  };
}

interface TableItem {
  id: number;
  advanceStart: number;
  advanceEnd: number;
  discount: GLfloat;
  status: boolean;
  gids: string;
  deliveryFee: GLfloat;
  delayTime: number;
  appDeliveryFee: GLfloat;
  isEditing: boolean; // Ensure this property is present for managing edit state
  showEditDishesButton: boolean; // 新增的用于控制显示编辑按钮的状态
}

const { Option } = Select;

const getStatusText = (status: boolean): string => {
  switch (status) {
    case false:
      return '关闭';
    case true:
      return '开启';
  }
};

const AreaActForm: React.FC<AreaActFormProps> = ({ visible, onCancel, value }) => {
  const [form] = Form.useForm();
  const [tableData, setTableData] = useState<TableItem[]>([]);
  const [draftData, setDraftData] = useState<TableItem[]>([]); // Use correct typing for draftData
  const [dishesEdits, setDishesEdits] = useState({}); // 存储编辑操作
  const [dishesData, setDishesData] = useState({}); // 存储每个 AreaAct id 对应的菜品列表

  const [allDishes, setAllDishes] = useState([]); // 存储所有的商品信息
  const [editModalVisible, setEditModalVisible] = useState(false); // 控制编辑商品的模态框显示
  const [currentActId, setCurrentActId] = useState(null); // 当前正在编辑的活动ID
  const [tempDishesSelection, setTempDishesSelection] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAreaAct({ id: value?.id });
        console.log('data' + res.data);
        if (res?.data) {
          const dataWithEditing = res.data.map((item) => ({ ...item, isEditing: false }));
          setTableData(dataWithEditing);
          setDraftData(dataWithEditing);
          dataWithEditing.forEach((item) => fetchDishes(item.id));

          // res.data.map((item) => {
          //   console.log('item:' + item.id);
          //   fetchDishes(item.id);
          // });
        }
      } catch (error) {
        message.error('Failed to fetch data');
      }
    };

    const fetchAllDishes = async () => {
      const response = await getAllDishes();
      if (response.data) {
        setAllDishes(response.data);
      }
    };

    if (visible) {
      fetchData();
      fetchAllDishes();
    }
  }, [visible, value?.id]);

  const fetchDishes = async (actId) => {
    try {
      console.log('fetch dishes for act ' + actId);
      const response = await getDishesByActId({ id: actId });
      const dishes = response.data || [];
      setDishesData((prev) => ({ ...prev, [actId]: dishes }));
    } catch (error) {
      message.error('Failed to fetch dishes for act ' + actId);
      setDishesData((prev) => ({ ...prev, [actId]: [] }));
    }
  };

  const handleEditDishes = (actId) => {
    setCurrentActId(actId);
    // 初始化 tempDishesSelection 以包括所有商品的选择状态
    const currentDishes = new Set(dishesData[actId]?.map((dish) => dish.gid));
    console.log('currentDishes:');
    console.table(currentDishes);
    console.log('allDishes:');
    console.table(allDishes);

    const initialSelection = allDishes.map((dish) => ({
      ...dish,
      selected: currentDishes.has(dish.id),
    }));
    console.log('initialSelection:');
    console.table(initialSelection);
    setTempDishesSelection(initialSelection);
    setEditModalVisible(true);
  };

  // const handleDishSelection = (dish, checked) => {
  //   setTempDishesSelection((prevSelection) => {
  //     console.log('dish_id' + dish.id);
  //     console.table(prevSelection);
  //     // 如果选中，则添加到数组中
  //     if (checked) {
  //       if (!prevSelection.some((item) => item.gid === dish.id)) {
  //         return [...prevSelection, dish];
  //       }
  //       return prevSelection; // 如果已经存在，则不重复添加
  //     } else {
  //       // 如果取消选中，则从数组中移除
  //       return prevSelection.filter((item) => item.gid !== dish.id);
  //     }
  //   });
  // };

  const handleDishSelection = (dish, checked) => {
    setTempDishesSelection((prevSelection) => {
      return prevSelection.map((item) => {
        if (item.id === dish.id) {
          return { ...item, selected: checked };
        }
        return item;
      });
    });
  };

  const toggleEditing = (id: number) => {
    const newDraftData = draftData.map((item) => {
      if (item.id === id) {
        const isEditing = !item.isEditing;
        if (isEditing) {
          //  handleEditDishes(id); // 这里打开模态窗口进行编辑
        }
        return { ...item, isEditing: isEditing, showEditDishesButton: isEditing };
      }
      return item;
    });
    setDraftData(newDraftData);
  };

  const handleDraftChange = (recordId: number, updatedValues: Partial<TableItem>) => {
    const newDraftData = draftData.map((item) => {
      if (item.id === recordId) {
        return { ...item, ...updatedValues };
      }
      return item;
    });
    setDraftData(newDraftData);
  };

  const handleSaveAllChanges = () => {
    const dataToSubmit = draftData.map((item) => {
      const { isEditing, showEditDishesButton, ...dataWithoutUnwantedFields } = item;
      const dishesForItem = dishesData[item.id];
      //return { ...item, dishes: dishesForItem }; // 确保每项数据都包含其关联的商品信息
      return { ...dataWithoutUnwantedFields, dishes: dishesForItem };
    });

    updateAreaActYxq(dataToSubmit) // 假设这个函数接受完整的数据
      .then(() => {
        message.success('所有更改已保存！');
        setTableData(dataToSubmit); // 更新原始数据，以反映新的状态
        onCancel(); // Use the onCancel prop to close the drawer
      })
      .catch((error) => {
        message.error('提交更改失败：' + error.message);
      });
  };

  const columns = [
    {
      title: '距截止时间（分钟）',
      key: 'timeSettings',
      render: (text, record) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ width: '45%' }}>
            {' '}
            {/* 给每个容器分配适当的宽度，总和小于100%以留有间隙 */}
            <div>起始时间:</div>
            <InputNumber
              min={0}
              max={14400}
              defaultValue={record.advanceStart}
              disabled={!record.isEditing}
              onChange={(value) => handleDraftChange(record.id, { advanceStart: value })}
              style={{ width: '100%' }} // 使输入框充满其容器
            />
          </div>
          <div style={{ width: '45%' }}>
            {' '}
            {/* 为结束时间也使用相同的设置 */}
            <div>结束时间:</div>
            <InputNumber
              min={0}
              max={14400}
              defaultValue={record.advanceEnd}
              disabled={!record.isEditing}
              onChange={(value) => handleDraftChange(record.id, { advanceEnd: value })}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      ),
    },
    {
      title: <span style={{ whiteSpace: 'nowrap' }}>菜品折扣</span>,
      dataIndex: 'discount',
      render: (text, record) =>
        record.isEditing ? (
          <InputNumber
            defaultValue={text}
            min={0}
            formatter={(value) => `${value}`}
            onChange={(value) => handleDraftChange(record.id, { discount: value })}
          />
        ) : (
          <span> {text}</span> // 使用 <span> 来包裹字符串，确保返回一个有效的JSX元素
        ),
    },
    {
      title: '关联商品',
      dataIndex: 'id',
      key: 'dishes',
      render: (id, record) => {
        const currentDishes = dishesData[id] || [];
        return (
          <>
            <ul>
              {currentDishes.map((dish) => (
                <li key={dish.id}>{dish.gname}</li>
              ))}
              {currentDishes.length > 3 && <li>...</li>}
            </ul>
            {record.showEditDishesButton && (
              <Button onClick={() => handleEditDishes(id)} type="link">
                编辑关联商品
              </Button>
            )}
          </>
        );
      },
    },
    {
      title: '配送费',
      dataIndex: 'deliveryFee',
      render: (text, record) =>
        record.isEditing ? (
          <InputNumber
            defaultValue={text}
            min={0}
            formatter={(value) => `￥ ${value}`}
            parser={(value) => value.replace('￥ ', '')}
            onChange={(value) => handleDraftChange(record.id, { deliveryFee: value })}
          />
        ) : (
          <span>￥ {text}</span> // 使用 <span> 来包裹字符串，确保返回一个有效的JSX元素
        ),
    },
    {
      title: 'app端配送费',
      dataIndex: 'appDeliveryFee',
      render: (text, record) =>
        record.isEditing ? (
          <InputNumber
            defaultValue={text}
            min={0}
            formatter={(value) => `￥ ${value}`}
            parser={(value) => value.replace('￥ ', '')}
            onChange={(value) => handleDraftChange(record.id, { appDeliveryFee: value })}
          />
        ) : (
          <span>￥ {text}</span> // 使用 <span> 来包裹字符串，确保返回一个有效的JSX元素
        ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status, record) =>
        record.isEditing ? (
          <Switch
            checked={status}
            onChange={(checked) => handleDraftChange(record.id, { status: checked })}
          />
        ) : (
          <span>{getStatusText(status)}</span> // 使用 <span> 来包裹字符串
        ),
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
      title="编辑楼宇活动"
      visible={visible}
      onClose={onCancel}
      width={1600}
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
      <Modal
        title="编辑关联商品"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => {
          // 当点击确定按钮时，更新全局状态
          //setDishesData((prev) => ({ ...prev, [currentActId]: tempDishesSelection }));
          //setEditModalVisible(false);

          // 只保存被选中的商品
          const selectedDishes = tempDishesSelection
            .filter((dish) => dish.selected)
            .map((dish) => ({
              id: dish.id, // 确保提交结构与预期一致
              gname: dish.gname,
              // 其他需要提交的菜品信息
            }));
          console.log('Submitting dishes for actId:', currentActId, selectedDishes);
          //setDishesData((prev) => ({ ...prev, [currentActId]: selectedDishes }));
          setDishesData((prev) => ({
            ...prev,
            [currentActId]: selectedDishes.map((dish) => ({ gid: dish.id, gname: dish.gname })),
          }));
          setEditModalVisible(false);
        }}
      >
        {allDishes.map((dish) => (
          <div key={dish.id}>
            <Switch
              checked={tempDishesSelection.some(
                (selected) => selected.id === dish.id && selected.selected,
              )}
              onChange={(checked) => handleDishSelection(dish, checked)}
            />{' '}
            {dish.gname}
          </div>
        ))}
      </Modal>

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

export default AreaActForm;
