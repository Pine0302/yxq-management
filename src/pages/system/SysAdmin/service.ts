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
export async function addSystemAdmin(
  data: { [key: string]: any },
  options?: { [key: string]: any },
) {
  return request<TableListItem>('/adminapi/system/user/add', {
    data,
    method: 'POST',
    requestType: 'form',
    ...(options || {}),
  });
}

/** 修改厨房用户 POST /adminapi/kitchen_user/modify */
export async function updateSystemAdmin(
  data: { [key: string]: any },
  options?: { [key: string]: any },
) {
  return request<TableListItem>('/adminapi/system/user/edit', {
    data,
    method: 'POST',
    requestType: 'form',
    ...(options || {}),
  });
}

export async function updateSystemUserPwd(
  data: { [key: string]: any },
  options?: { [key: string]: any },
) {
  return request<TableListItem>('/adminapi/system/user/editPwd', {
    data,
    method: 'POST',
    requestType: 'form',
    ...(options || {}),
  });
}

/** 修改厨房用户 POST /adminapi/kitchen_user/modify */
export async function deleteSystemUser(
  data: { [key: string]: any },
  options?: { [key: string]: any },
) {
  return request<TableListItem>('/adminapi/system/user/delete', {
    data,
    method: 'POST',
    requestType: 'form',
    ...(options || {}),
  });
}

// 假设这是更新状态的API函数
// 导出updateKitchenLiveStatus函数，与deleteKitchenLive样式相同
export async function updateSystemUserStatus(
  data: { id: number | string; status: number | string },
  options?: { [key: string]: any },
) {
  return request<TableListItem>('/adminapi/system/user/updateSystemUserStatus', {
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
