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
export type KitchenUserTableWrapper = {
  code?: number;
  msg?: string;
  success?: boolean;
  data?: {
    list?: KitchenUserTableItem[];
    pageNum?: number;
    current?: number;
    pageSize?: number;
    total?: number;
  };
};

/** 配送员分页数据 - 单条数据 */
export type KitchenLiveTableItem = {
  id: number;
  kitchenName: string;
  liveName: string;
  status: number;
  sort: number;
};
