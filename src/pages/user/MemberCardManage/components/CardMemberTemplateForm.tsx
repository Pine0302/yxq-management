import React, { useState, useRef, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Form, Input, Table, Drawer, Button, Select, TimePicker, Modal, message } from 'antd';
import { ModalForm, ProFormText } from '@ant-design/pro-form';

import { InputNumber, Popconfirm } from 'antd';

import { fetchCardMemberTemplate } from '../service';
import type { TableListPagination, TemlateAreaGoodsTableItem } from '../data';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';

import { Stock } from '@ant-design/charts';

interface AreaGoodsTemplateFormProps {
  visible: boolean;
  onCancel: () => void;
  cardId?: number; // 确保传递 areaId
}

interface BuildingFormValues {
  addressName: string;
  sort: number;
  id?: number; // 可选，因为新建时不需要ID
  parentId?: number; // 可选，因为新建时不需要父ID
  cardId?: number; //
  isEdit?: boolean;
}

type DataItem = {
  id: number;
  gid: number;
  gname: string;
  total: number;
  sold: number;
  newStock: number;
};
const CardMemberTemplateForm: React.FC<AreaGoodsTemplateFormProps> = ({
  visible,
  onCancel,
  cardId,
}) => {
  const actionRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState(false);
  const [subModalVisible, setSubModalVisible] = useState(false);
  const [sub2ModalVisible, setSub2ModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [currentRecord, setCurrentRecord] = useState<BuildingFormValues | null>(null);
  const [subDrawerVisible, setSubDrawerVisible] = useState<boolean>(false); // 控制subDrawer的显示
  const [subKey, setSubKey] = useState(0);
  const [ds, setDs] = useState<DataItem[]>([]);
  const [inputValue, setInputValue] = useState<number | null>(null);

  useEffect(() => {
    console.log('currentRecord-------:', currentRecord);
    if (!subDrawerVisible && currentRecord && currentRecord.isEdit == false) {
      // 当Drawer关闭并且currentRecord更新后，重新打开Drawer
      setSubDrawerVisible(true);
    }
  }, [subDrawerVisible, currentRecord]);

  const columns: ProColumns<TemlateAreaGoodsTableItem>[] = [
    {
      title: '用户们',
      dataIndex: 'username',
      search: false,
    },
    // {
    //   title: '已售',
    //   dataIndex: 'sellnum',
    //   search: false,
    // },
    {
      title: '手机号',
      dataIndex: 'phone',
      search: false,
    },

    {
      title: '开通时间',
      dataIndex: 'startTimeText',
      search: false,
    },

    {
      title: '截至时间',
      dataIndex: 'endTimeText',
      search: false,
    },

    {
      title: '是否有效',
      dataIndex: 'status',
      search: false,
      render: (text: any, record: any) => (text === 1 ? '有效' : '无效'),
    },
  ];

  const tableRequest = async (params?: { pageSize: number; current: number }) => {
    console.log(params, 'params');
    console.log(cardId, 'cardId');
    const res = await fetchCardMemberTemplate({
      ...params,
      cardId: cardId,
      pageNum: params?.current,
    });
    return { data: res.data?.list, success: true, total: res.data?.total };
  };

  return (
    <PageContainer
    //header={{
    //title: false, // 隐藏标题
    //breadcrumb: undefined, // 隐藏面包屑
    //}}
    >
      <ProTable<TemlateAddressTableItem, TableListPagination>
        actionRef={actionRef}
        rowKey="id"
        //search={true} // 设置为 false 来禁用搜索功能
        toolBarRender={() => [
          <Button
            type="primary"
            key="createnew"
            onClick={() => {
              setModalVisible(true); // 打开模态框
              //  setIsEdit(false); // 设置为非编辑模式
              setCurrentRecord(null); // 清空当前行记录，确保表单为空
            }}
          >
            {/* <PlusOutlined /> 新建 */}
          </Button>,
        ]}
        request={tableRequest}
        //dataSource={ds}
        columns={columns}
        // rowSelection={{
        //   onChange: (_, selectedRows) => {
        //     console.log(selectedRows);
        //     // setSelectedRows(selectedRows);
        //   },
        // }}
      />
    </PageContainer>
  );
};

export default CardMemberTemplateForm;
