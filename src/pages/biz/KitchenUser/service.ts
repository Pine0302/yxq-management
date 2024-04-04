// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { KitchenUserTableWrapper, TableListItem } from './data';

/** 获取配送员列表 */
export async function kitchenUserPageInfo(
  params: { current?: number; pageSize?: number; pageNum?: number },
  options?: { [key: string]: any },
) {
  return request<KitchenUserTableWrapper>('/adminapi/kitchen_user/page_info?source=1', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建厨房用户 POST /adminapi/kitchen_user/add */
export async function addKitchenUser(
  data: { [key: string]: any },
  options?: { [key: string]: any },
) {
  return request<TableListItem>('/adminapi/kitchen_user/add', {
    data,
    method: 'POST',
    requestType: 'form',
    ...(options || {}),
  });
}

/** 修改厨房用户 POST /adminapi/kitchen_user/modify */
export async function updateKitchenUser(
  data: { [key: string]: any },
  options?: { [key: string]: any },
) {
  return request<TableListItem>('/adminapi/kitchen_user/modify', {
    data,
    method: 'POST',
    requestType: 'form',
    ...(options || {}),
  });
}
