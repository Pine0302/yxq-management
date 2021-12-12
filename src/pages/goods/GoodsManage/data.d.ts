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

  status?: number;
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

/** 商品管理分页数据 */
export type GoodsTableWrapper = {
  code?: number;
  msg?: string;
  success?: boolean;
  data?: {
    list?: GoodsTableItem[];
    pageNum?: number;
    pageSize?: number;
    total?: number;
  };
};

/** 商品管理分页数据 - 单条数据 */
export type GoodsTableItem = {
  // actualAddPrice: null
  // addPrice: null
  // checkStatus: null
  cid?: number;
  content?: string;
  // expectedPrice: null
  gname?: string;
  id?: 2;
  // limitBuy: null
  // limitNum: null
  originalPrice?: number;
  packageFee?: number;
  pic?: string;
  price?: number;
  status?: boolean;
  type?: string;
};

export type GoodsDetailWrapper = {
  code?: number;
  msg?: string;
  success?: boolean;
  data?: GoodsDetail;
};

export type GoodsDetail = {
  // id: 1
  // cid: 2
  // content: "酸辣土豆丝"
  // gname: "酸辣土豆丝"
  // originalPrice: 6.88
  // pic: "/2021/10/26/ebb8cf2e39332fa41b1f65c020b077db.png"
  // price: 3
  // sideDishGoods: null
  // status: true
  // type: "SIDE_DISH"
};
