// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 通用下拉列表数据 */


/** 获取商品类目list */
export async function goodsClassPageInfo( params: any, options?: { [key: string]: any }, ) {
  return request<Common.GoodsClassListWrapper>('/adminapi/goods/goods_class_page_info', {
    method: 'GET',
    params: {
      ...params,
      pageNum: 1,
      pageSize: 1000,
    },
    ...(options || {}),
  });
}