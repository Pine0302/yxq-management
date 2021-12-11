// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { GoodsClassTableWrapper, TableListItem } from './data';

/** 商品类目分页信息 */
export async function goodsClassPageInfo( params: { current?: number; pageSize?: number; }, options?: { [key: string]: any }, ) {
  return request<GoodsClassTableWrapper>('/adminapi/goods/goods_class_page_info', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建商品类目 */
export async function addGoodsClass(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<TableListItem>('/adminapi/goods/add_goods_class', {
    data,
    method: 'POST',
    requestType: 'form',
    ...(options || {}),
  });
}

/** 更新商品类目 */
export async function modifyGoodsClass(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<TableListItem>('/adminapi/goods/modify_goods_class', {
    data,
    method: 'POST',
    requestType: 'form',
    ...(options || {}),
  });
}






/** 新建规则 PUT /api/rule */
export async function updateRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<TableListItem>('/api/rule', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(data: { key: number[] }, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}
