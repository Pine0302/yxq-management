export type TableListItem = {
  key: number;
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

/** 楼宇分页数据 */
export type BuildingTableWrapper = {
  code?: number;
  msg?: string;
  success?: boolean;
  data?: {
    list?: BuildingTableItem[];
    pageNum?: number;
    current?: number;
    pageSize?: number;
    total?: number;
  };
};

/** 楼宇分页数据 - 单条数据 */
export type BuildingTableItem = {
  id: number;
  areaName: string;
  city: string;
  ctime: string;
  district: string;
  isDelete: string;
  kitchenId: 1;
  latitude: string;
  longitude: string;
  pickUpAddress: string;
  pickUpType: string;
  province: string;
  status: string;
};

export type TemlateAddressTableItem = {
  id: number;
  addressName: string;
  areaId: number;
  parentId: number;
  sort: number;
  isEdit: boolean;
};

export type TemlateAddressTableWrapper = {
  data: {
    total: number;
    list: TemlateAddressTableItem[];
  };
};
