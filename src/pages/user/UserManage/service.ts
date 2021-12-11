// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { UserTableWrapper } from './data';

/** 获取用户列表 */
export async function userPageInfo(
  params: { current?: number; pageSize?: number },
  options?: { [key: string]: any },
) {
  return request<UserTableWrapper>('/adminapi/user/page_info', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
