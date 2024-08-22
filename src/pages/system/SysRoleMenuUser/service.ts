// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { SysRoleMenuUser, SysRoleMenuUserUpdate } from './data';

//获取某个角色对应绑定的用户
export async function getSysRoleUserMenuInfo(
  params: { roleId?: number },
  options?: { [key: string]: any },
) {
  console.log('params', params);
  return request<SysRoleMenuUser>('/adminapi/system/role/getSysRoleUserMenuInfo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

//获取某个角色对应绑定的用户
export async function removeRoleUser(
  params: { roleId?: number; userId?: number },
  options?: { [key: string]: any },
) {
  console.log('params', params);
  return request<SysRoleMenuUser>('/adminapi/system/role/removeRoleUser', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

interface UpdateUserData {
  roleId: number;
  targetKeys: string[];
}

export async function updateUser(data: UpdateUserData, options?: { [key: string]: any }) {
  return request<SysRoleMenuUserUpdate>('/adminapi/system/role/updateRoleUser', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}
