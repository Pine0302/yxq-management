// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { KitchenTableWrapper, TableListItem } from './data';

/** 获取用户列表 */
export async function kitchenPageInfo(
  params: { current?: number; pageSize?: number },
  options?: { [key: string]: any },
) {
  return request<KitchenTableWrapper>('/adminapi/kitchen/page_info', {
    method: 'GET',
    params: {
      ...params,
    },
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

/** 新建规则 POST /api/rule */
export async function addRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<TableListItem>('/api/rule', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}
