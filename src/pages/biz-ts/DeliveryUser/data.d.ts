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

/** 配送员分页数据 */
export type DeliveryUserTableWrapper = {
  code?: number;
  msg?: string;
  success?: boolean;
  data?: {
    list?: DeliveryUserTableItem[];
    pageNum?: number;
    current?: number;
    pageSize?: number;
    total?: number;
  };
};

/** 配送员分页数据 - 单条数据 */
export type DeliveryUserTableItem = {
  id: number;
  areaId: number;
  areaName: string;
  code: string;
  ctime: string;
  deviceId: string;
  lastTime: string;
  name: string;
  phone: string;
  status: number;
};
