declare namespace Common {
  // 服务器默认返回数据封装
  export type ResponseWrapper<T = any> = {
    code?: number;
    msg?: string;
    success?: boolean;
    data?: T;
  };

  export type GoodsClassListWrapper = {
    code?: number;
    msg?: string;
    success?: boolean;
    data?: {
      list?: GoodsClassListItem[];
      pageNum?: number;
      current?: number;
      pageSize?: number;
      total?: number;
    };
  };

  export type GoodsClassListItem = {
    id: number;
    className: string;
  };
}
