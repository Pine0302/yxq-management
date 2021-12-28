// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { TableListItem } from './data';

/** 新建规则 POST /api/rule */
export async function addRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<TableListItem>('/api/rule', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

/** 优惠券记录分页信息 GET /adminapi/user_coupon/page_info */
export async function couponLogPageInfo(
  params: { current?: number; pageSize?: number; pageNum?: number },
  options?: { [key: string]: any },
) {
  return request<Common.ResponseWrapper>('/adminapi/user_coupon/page_info', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
