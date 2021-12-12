// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { GoodsTableWrapper } from './data';

/** 商品分页列表 */
export async function goodsPageInfo(
  data: { [key: string]: any },
  options?: { [key: string]: any },
) {
  return request<GoodsTableWrapper>('/adminapi/goods/goods_page_info', {
    data,
    method: 'POST',
    requestType: 'form',
    ...(options || {}),
  });
}

/** 获取商品详情 GET /adminapi/goods/goods_detail */
export async function goodsDetail(params: { id: number }, options?: { [key: string]: any }) {
  return request<GoodsTableWrapper>('/adminapi/goods/goods_page_info', {
    params: params,
    method: 'GET',
    ...(options || {}),
  });
}
