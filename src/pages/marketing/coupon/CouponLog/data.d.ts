export type TableListItem = {
  id: number;
  couponName: string;
  status: boolean;
  // activityGoods: [{id: 6, cid: 1, gname: "鱼香肉丝套餐", price: 8.8, originalPrice: 38.88,…},…]
  // couponId: 1
  deliveryFree: boolean;
  // deviceId: "111"
  // discount: 0
  // discountRemark: null
  // endTime: "2021-10-28T23:59:59"
  // gids: "6,9,10,11"
  packageFree: boolean;
  // payFull: 50
  // reduce: 50
  // remark: null
  // startTime: "2021-10-26T17:09:39"
  type: string;
  uid: 1
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
