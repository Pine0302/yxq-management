// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { KitchenTableWrapper } from './data';

/** 获取厨房列表 */
export async function kitchenPageInfo(
  params: { current?: number; pageSize?: number; pageNum?: number },
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
