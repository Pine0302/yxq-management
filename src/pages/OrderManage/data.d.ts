export type TableListItem = {
  key: number;
  id?: number;
  disabled?: boolean;
  href: string;
  avatar: string;
  name: string;
  owner: string;
  desc: string;
  callNo: number;
  status: string;
  updatedAt: Date;
  createdAt: Date;
  progress: number;
  remark: string;
};

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type TableListData = {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
};

export type TableListParams = {
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};

export type OrderDataWrapper = {
  code?: number;
  msg?: string;
  success?: boolean;
  data?: {
    list?: TableListItem[];
    pageNum?: number;
    pageSize?: number;
    total?: number;
  };
};

export type OrderDetailWrapper = {
  code?: number;
  msg?: string;
  success?: boolean;
  data?: OrderDetailDTO;
};

export type OrderDetailDTO = {
  orderSn?: string;

  packageFee: number;
  deliveryFee: number;

  cartDTOS?: cartItemDTO[];
  orderAddressDTO?: OrderAddressDTO;
  payment?: PaymentDTO;
};

export type OrderAddressDTO = {
  address: string;
  building: string;
  contacts: string;
  gender: string;
  houseNumber: string;
  id: number;
  label: string;
  latitude: string;
  longitude: string;
  oid: number;
  phone: string;
  uid: number;
};

export type PaymentDTO = {
  createTime: string;
  fee: number;
  outTradeNo: string;
  payType: string;
};

export type cartItemDTO = {
  gid?: number;
  gname?: string;
  amount?: number;
  price?: number;
  realPrice?: number;
  packageFee?: number;
};
