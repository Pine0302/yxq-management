// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { DeliveryUserTableWrapper, TableListItem } from './data';

/** 获取配送员列表 */
export async function deliveryUserPageInfo(
  params: { current?: number; pageSize?: number; pageNum?: number },
  options?: { [key: string]: any },
) {
  return request<DeliveryUserTableWrapper>('/adminapi/delivery_user/page_info', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建配送员 POST /adminapi/delivery_user/add */
export async function addDeliveryUser(
  data: { [key: string]: any },
  options?: { [key: string]: any },
) {
  return request<TableListItem>('/adminapi/delivery_user/add', {
    data,
    method: 'POST',
    requestType: 'form',
    ...(options || {}),
  });
}

/** 修改配送员 POST /adminapi/delivery_user/add */
export async function updateDeliveryUser(
  data: { [key: string]: any },
  options?: { [key: string]: any },
) {
  return request<TableListItem>('/adminapi/delivery_user/modify', {
    data,
    method: 'POST',
    requestType: 'form',
    ...(options || {}),
  });
}
