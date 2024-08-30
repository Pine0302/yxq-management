// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { KitchenUserTableWrapper, TableListItem, GoodsClassTableItemwrapper } from './data';

/** 获取配送员列表 */
export async function userMenuPageInfo(
  params: { current?: number; pageSize?: number; pageNum?: number },
  options?: { [key: string]: any },
) {
  return request<KitchenUserTableWrapper>('/adminapi/user_menu/page_info', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建厨房用户 POST /adminapi/kitchen_user/add */
export async function addKitchenLive(
  data: { [key: string]: any },
  options?: { [key: string]: any },
) {
  return request<TableListItem>('/adminapi/kitchen_live/add', {
    data,
    method: 'POST',
    requestType: 'form',
    ...(options || {}),
  });
}

/** 修改厨房用户 POST /adminapi/kitchen_user/modify */
export async function updateMenuUser(
  data: { [key: string]: any },
  options?: { [key: string]: any },
) {
  return request<TableListItem>('/adminapi/user_menu/modify', {
    data,
    method: 'POST',
    requestType: 'form',
    ...(options || {}),
  });
}

/** 修改厨房用户 POST /adminapi/kitchen_user/modify */
export async function deleteKitchenLive(
  data: { [key: string]: any },
  options?: { [key: string]: any },
) {
  return request<TableListItem>('/adminapi/kitchen_live/delete', {
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

export async function getAllGoodsClass() {
  return request<GoodsClassTableItemwrapper>('/adminapi/user_menu/get_all_goods_class', {
    method: 'GET',
  });
}
