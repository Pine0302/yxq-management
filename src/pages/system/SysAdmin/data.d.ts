import { update } from 'lodash';
import { ISO_8601, parseTwoDigitYear } from 'moment';

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

/** 配送员分页数据 */
export type SystemAdminTable = {
  code?: number;
  msg?: string;
  success?: boolean;
  data?: {
    list?: SystemAdminItem[];
  };
};

/** 配送员分页数据 */
export type SystemAdminTableWrapper = {
  code?: number;
  msg?: string;
  success?: boolean;
  data?: {
    list?: SystemAdminItem[];
    pageNum?: number;
    current?: number;
    pageSize?: number;
    total?: number;
  };
};

export type SystemAdmin = {
  id: number;
  account: string;
  password: string;
  realName: string;
  nickName: string;
  status: number;
  statusInt: number;
  lastIp: string;
  deptId: number;
  phone: string;
  email: string;
  avatarName: string;
  avatarPath: string;
  isAdmin: boolean;
  createBy: string;
  updateBy: string;
  updateTime: string;
  createTime: string;
  pwd_reset_time: string;
  isDel: number;
  company: string;
  dept: string;
  position: string;
};

export type SystemAdminItem = {
  id: number;
  account: string;
  password: string;
  realName: string;
  nickName: string;
  status: number;
  lastIp: string;
  deptId: number;
  phone: string;
  email: string;
  avatarName: string;
  avatarPath: string;
  isAdmin: boolean;
  createBy: string;
  updateBy: string;
  updateTime: string;
  createTime: string;
  pwd_reset_time: string;
  isDel: number;
  company: string;
  dept: string;
  position: string;
  list?: systemRoles[];
};

export type systemRoles = {
  roleId: number;
  name: string;
  description: string;
  typeName: string;
};
