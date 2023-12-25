// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { KitchenTableWrapper } from './data';

/** 获取厨房列表 */
export async function kitchenPageInfo(
  params: { current?: number; pageSize?: number; pageNum?: number },
  options?: { [key: string]: any },
) {
  return request<KitchenTableWrapper>('/adminapi/kitchen/page_info?source=2', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建厨房 POST /adminapi/kitchen/add */
export async function addKitchen(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<Common.ResponseWrapper>('/adminapi/kitchen/add', {
    data,
    method: 'POST',
    requestType: 'form',
    ...(options || {}),
  });
}

/** 修改厨房 POST /adminapi/kitchen/modify */
export async function editKitchen(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<Common.ResponseWrapper>('/adminapi/kitchen/modify', {
    data,
    method: 'POST',
    requestType: 'form',
    ...(options || {}),
  });
}

// 获取厨房库存分页信息
export async function kitchenStockPageInfo(
  params: { current?: number; pageSize?: number; pageNum?: number; kitchenId: number },
  options?: { [key: string]: any },
) {
  return request<Common.ResponseWrapper>('/adminapi/kitchen_stock/kitchen_goods_stock?source=2', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function editKitchenStock(
  data: { [key: string]: any },
  options?: { [key: string]: any },
) {
  return request<Common.ResponseWrapper>('/adminapi/kitchen_stock/edit_kitchen_goods_stock', {
    data,
    method: 'POST',
    requestType: 'form',
    ...(options || {}),
  });
}
