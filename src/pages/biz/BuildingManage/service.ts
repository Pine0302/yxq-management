// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { BuildingTableWrapper, TableListItem } from './data';

/** 获取楼宇列表 */
export async function buildingPageInfo(
  params: { current?: number; pageSize?: number; pageNum?: number },
  options?: { [key: string]: any },
) {
  return request<BuildingTableWrapper>('/adminapi/area/page_info?source=1', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建楼宇 POST /adminapi/area/add */
export async function addBuilding(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<TableListItem>('/adminapi/area/add', {
    data,
    method: 'POST',
    requestType: 'form',
    ...(options || {}),
  });
}

/** 修改楼宇 POST /adminapi/area/modify */
export async function editBuilding(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<TableListItem>('/adminapi/area/modify', {
    data,
    method: 'POST',
    requestType: 'form',
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<TableListItem>('/api/rule', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<TableListItem>('/api/rule', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

/** 获取楼宇的餐点 GET /adminapi/area/area_time */
export async function getAreaDayDinnerConfig(
  params: { [id: number]: any },
  options?: { [key: string]: any },
) {
  return request<TableListItem>('/adminapi/area/area_time', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
/** 更新楼宇的餐点 GET /adminapi/area/modifyAreaTimeConfig */
export async function updateAreaTimeConfigYxq(
  data: { [key: string]: any },
  options?: { [key: string]: any },
) {
  return request<TableListItem>('/adminapi/area/modifyAreaTimeConfig', {
    data,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/** 获取楼宇的周营业 GET /adminapi/area/area_time */
export async function getAreaWeek(params: { [id: number]: any }, options?: { [key: string]: any }) {
  return request<TableListItem>('/adminapi/area/area_week', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新楼宇的周营业 UPDATE /adminapi/area/modifyAreaWeekConfig */
export async function updateAreaWeekConfigYxq(
  data: { [key: string]: any },
  options?: { [key: string]: any },
) {
  return request<TableListItem>('/adminapi/area/modifyAreaWeekConfig', {
    data,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/** 获取楼宇的活动 GET /adminapi/area/area_act */
export async function getAreaAct(params: { [id: number]: any }, options?: { [key: string]: any }) {
  return request<TableListItem>('/adminapi/area/area_act', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新楼宇的活动 UPDATE /adminapi/area/modifyAreaAct */
export async function updateAreaActYxq(
  data: { [key: string]: any },
  options?: { [key: string]: any },
) {
  return request<TableListItem>('/adminapi/area/modifyAreaActConfig', {
    data,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/** 获取活动关联的商品信息 GET /adminapi/area/area_act_goods */
export async function getDishesByActId(
  params: { [id: number]: any },
  options?: { [key: string]: any },
) {
  return request<TableListItem>('/adminapi/area/areaActGoodsByActId', {
    params: {
      ...params,
    },
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/** 获取活动关联的商品信息 GET /adminapi/area/area_act_goods */
export async function getAllDishes(
  params?: { [id: number]: any },
  options?: { [key: string]: any },
) {
  return request<TableListItem>('/adminapi/goods/onsale_dishes', {
    params: {
      ...params,
    },
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}
