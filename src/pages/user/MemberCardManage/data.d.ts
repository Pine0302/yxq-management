export type TableListItem = {
  id: number;
  name: string;
  type: string;
  deliveryFree: boolean;
  packageFree: boolean;
  totalAmount: number;
  price: number;
  days: number;
  memberCardCouponDTOList: List[MemberCardCoupon];
  discount: number; //折扣
  createTime: string;
  updateTime: string;
  limitPerUser: number;
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

export type SelectedCoupon = {
  id: number;
  cardId: number;
  couponId: number;
  name: string;
  num: number;
  rule: string;
};

export type CouponType = {
  id: number;
  name: string;
  type: string;
  deliveryFree: boolean;
  packageFree: boolean;
  totalAmount: number;
  reduce: number;
  discount: number; //折扣
  startTime: string;
  endTime: string;
  limitPerUser: number;
  remark: string;
  status: boolean;
  sendStatus: number;
};

export interface MemberCardInterestType {
  id?: number;
  type: number;
  number: number;
  fixedMenu: string;
  gids: string;
  useTimes: number;
  end: number;
  isTemp?: boolean;
}
