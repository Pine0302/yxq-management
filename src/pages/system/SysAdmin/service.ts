// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { SystemAdminTableWrapper, SystemAdminTable, TableListItem } from './data';

/** 获取配送员列表 */
export async function sysAdminPageInfo(
  params: { current?: number; pageSize?: number; pageNum?: number },
  options?: { [key: string]: any },
) {
  return request<SystemAdminTableWrapper>('/adminapi/system/user/page_info', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建厨房用户 POST /adminapi/kitchen_user/add */
export async function addSystemRole(
  data: { [key: string]: any },
  options?: { [key: string]: any },
) {
  return request<TableListItem>('/adminapi/system/role/add', {
    data,
    method: 'POST',
    requestType: 'form',
    ...(options || {}),
  });
}

/** 修改厨房用户 POST /adminapi/kitchen_user/modify */
export async function updateSystemRole(
  data: { [key: string]: any },
  options?: { [key: string]: any },
) {
  return request<TableListItem>('/adminapi/system/role/edit', {
    data,
    method: 'POST',
    requestType: 'form',
    ...(options || {}),
  });
}

/** 修改厨房用户 POST /adminapi/kitchen_user/modify */
export async function deleteRole(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<TableListItem>('/adminapi/system/role/delete', {
    data,
    method: 'POST',
    requestType: 'form',
    ...(options || {}),
  });
}

// 假设这是更新状态的API函数
// 导出updateKitchenLiveStatus函数，与deleteKitchenLive样式相同
export async function updateKitchenLiveStatus(
  data: { id: number | string; status: number | string },
  options?: { [key: string]: any },
) {
  return request<TableListItem>('/adminapi/kitchen_live/updateLiveStatus', {
    data,
    method: 'POST',
    requestType: 'form',
    ...(options || {}),
  });
}

//获取某个角色对应绑定的用户
export async function getRoleUserNum(
  params: { roleId?: number },
  options?: { [key: string]: any },
) {
  console.log('params', params);
  return request<SystemAdminTable>('/adminapi/system/role/roleUserNum', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
