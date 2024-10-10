export type TableListItem = {
  id: number;
  name: string;
  type: string;
  deliveryFree: boolean;
  packageFree: boolean;
  totalAmount: number;
  reduce: number;
  //   activityAreas: [,…]
  // activityGoods: [{id: 5, cid: 1, gname: "黄豆猪蹄套餐", price: 26.8, originalPrice: 32.88,…},…]
  discount: number; //折扣
  startTime: string;
  endTime: string;
  // fixAreaList: [1, 44]
  // fixedArea: "1,44"
  // gids: "5,6,8,9,10,11,23,24,25,29,30,31,32,37,38,39,40,41,42"
  // gidsList: [5, 6, 8, 9, 10, 11, 23, 24, 25, 29, 30, 31, 32, 37, 38, 39, 40, 41, 42]
  limitPerUser: number;
  // payFull: 50
  // pic: "/2021/09/01/1fa6b44e180ad83863979a0f93b9e776.png"
  // reduce: 50
  remark: string;
  status: boolean;
  sendStatus: number;
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
