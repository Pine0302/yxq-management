
declare namespace Common {
  export type GoodsClassListWrapper = {
    code?: number;
    msg?: string;
    success?: boolean;
    data?: {
      list?: GoodsClassListItem[];
      pageNum?: number;
      current?: number
      pageSize?: number;
      total?: number;
    };
  }
  
  export type GoodsClassListItem = {
    id: number;
    className: string;
  }



}