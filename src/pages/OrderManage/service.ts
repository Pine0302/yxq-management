// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { OrderDataWrapper, TableListItem, OrderDetailWrapper } from './data';

// 订单分页信息
export async function orderPageInfo(params: any, options?: { [key: string]: any },) {
  return request<OrderDataWrapper>('/adminapi/order/page_info', {
    method: 'GET',
    params: params,
    ...(options || {}),
  });
}

export async function orderDetail(params: {id: number}, options?: { [key: string]: any },) {
  return request<OrderDetailWrapper>('/adminapi/order/detail', {
    method: 'GET',
    params: params,
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
