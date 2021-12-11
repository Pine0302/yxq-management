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

/** 商品类目管理分页数据 */
export type GoodsClassTableWrapper = {
  code?: number;
  msg?: string;
  success?: boolean;
  data?: {
    list?: GoodsClassTableItem[];
    pageNum?: number;
    current?: number
    pageSize?: number;
    total?: number;
  };
};

/** 商品类目管理分页数据 - 单条数据 */
export type GoodsClassTableItem = {
  id: number;
  className: string;
  parentid: number;
  sort: number;
};
