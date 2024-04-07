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
