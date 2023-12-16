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
  return request<Common.ResponseWrapper<any>>('/adminapi/goods/goods_detail', {
    params: params,
    method: 'GET',
    requestType: 'form',
    ...(options || {}),
  });
}

/** 新增商品 POST /adminapi/goods/add_goods */
export async function addGoods(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<GoodsTableWrapper>('/adminapi/goods/add_goods', {
    data,
    method: 'POST',
    requestType: 'json',
    ...(options || {}),
  });
}

/** 编辑商品 POST /adminapi/goods/edit_goods */
export async function editGoods(data: { id: number, [key: string]: any }, options?: { [key: string]: any }) {
  return request<GoodsTableWrapper>('/adminapi/goods/edit_goods', {
    data,
    method: 'POST',
    requestType: 'json',
    ...(options || {}),
  });
}

/** 商品上下架 POST /adminapi/goods/edit_goods_status */
export async function updateGoodsStatus(
  data: { [key: string]: any },
  options?: { [key: string]: any },
) {
  return request<Common.ResponseWrapper<boolean>>('/adminapi/goods/edit_goods_status', {
    data,
    method: 'POST',
    requestType: 'form',
    ...(options || {}),
  });
}

/** 获取配菜列表 POST /adminapi/goods/side_dish_list */
export async function getSideDishList(
  data: { [key: string]: any },
  options?: { [key: string]: any },
) {
  return request<Common.ResponseWrapper<any>>('/adminapi/goods/side_dish_list', {
    data,
    method: 'POST',
    requestType: 'form',
    ...(options || {}),
  });
}
