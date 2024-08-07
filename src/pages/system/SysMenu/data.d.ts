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

/** menu数据 */
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

export type SysMenuTableWrapper = {
  code?: number;
  msg?: string;
  success?: boolean;
  data?: {
    list?: SysMenuTableItem[];
  };
};

/** 配送员分页数据 - 单条数据 */
/*
private Long menuId;
private List<SystemMenuResult> children;
private Integer type;
private String permission;
private String title;
private Integer menuSort;
private String path;
private String component;
private Long pid;
private Integer subCount;
private Boolean iFrame;
private Boolean cache;
private Boolean hidden;
private String componentName;
private String icon;
*/

export type SysMenuTableItem = {
  menuId: number;
  children: List<SysMenuTableItem>;
  type: number;
  permission: string;
  title: string;
  menuSort: number;
  path: string;
  component: string;
  pid: number;
  subCount: number;
  iFrame: boolean;
  cache: boolean;
  hidden: boolean;
  componentName: string;
  icon: string;
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
export type SystemAdminTableWrapper = {
  code?: number;
  msg?: string;
  success?: boolean;
  data?: {
    list?: SystemAdminItem[];
  };
};

export type SystemAdminItem = {
  id: number;
  account: string;
  password: string;
  realName: string;
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
  is_del: number;
  company: string;
  dept: string;
  position: string;
};
