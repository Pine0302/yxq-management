import React, { useState, useEffect } from 'react';
import { Tree } from 'antd';
import { request } from 'umi'; // 使用umi的request进行API请求

const formatMenuData = (menus) => {
  return menus.map((menu) => ({
    key: menu.menuId,
    title: menu.title,
    children: menu.children ? formatMenuData(menu.children) : [],
  }));
};

const fetchMenuData = async () => {
  const response = await request('/adminapi/system/menu/list', {
    method: 'GET',
  });
  return response.data; // 确保这里与后端返回的数据结构匹配
};

const MenuTree = () => {
  const [menuData, setMenuData] = useState([]);

  useEffect(() => {
    fetchMenuData().then((data) => {
      const formattedData = formatMenuData(data);
      setMenuData(formattedData);
    });
  }, []);

  return <Tree treeData={menuData} />;
};

export default MenuTree;
