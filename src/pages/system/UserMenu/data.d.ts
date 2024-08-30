export type TableListItem = {
  id: number;
  hidden?: boolean;
  name: string;
  showName: string;
  goodsCates: string;
  code: string;
  sort: number;
  status: string;
  createTtime: Date;
  updateTime: Date;
  cates: GoodsClassTableItem[]; // 商品类目
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
    list?: TableListItem[];
    pageNum?: number;
    current?: number;
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

/** 配送员分页数据 */
export type GoodsClassTableItemwrapper = {
  code?: number;
  msg?: string;
  success?: boolean;
  data?: {
    list?: GoodsClassTableItem[];
  };
};
