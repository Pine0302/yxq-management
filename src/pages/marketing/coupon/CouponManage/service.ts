// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 优惠券分页信息 GET /adminapi/coupon/page_info */
export async function couponPageInfo(
  params: { current?: number; pageSize?: number; pageNum?: number },
  options?: { [key: string]: any },
) {
  return request<Common.ResponseWrapper>('/adminapi/coupon/page_info', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建优惠券 POST /adminapi/coupon/add */
export async function addCoupon(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<Common.ResponseWrapper>('/adminapi/coupon/add', {
    data,
    method: 'POST',
    requestType: 'form',
    ...(options || {}),
  });
}

/** 编辑优惠券 POST /adminapi/coupon/modify */
export async function editCoupon(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<Common.ResponseWrapper>('/adminapi/coupon/modify', {
    data,
    method: 'POST',
    requestType: 'form',
    ...(options || {}),
  });
}
/** 发送优惠券 POST /adminapi/coupon/modify */
export async function sendCoupon(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<Common.ResponseWrapper>('/adminapi/coupon/send', {
    data,
    method: 'POST',
    requestType: 'form',
    ...(options || {}),
  });
}

/** s删除优惠券 POST /adminapi/kitchen_user/modify */
export async function deleteCoupon(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<Common.ResponseWrapper>('/adminapi/coupon/delete', {
    data,
    method: 'POST',
    requestType: 'form',
    ...(options || {}),
  });
}

/** 发送优惠券人数预计 POST /adminapi/coupon/modify */
export async function sendEstimate(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<Common.ResponseWrapper>('/adminapi/coupon/sendEstimate', {
    data,
    method: 'POST',
    requestType: 'form',
    ...(options || {}),
  });
}
