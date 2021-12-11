export default [
  {
    path: '/admin',
    layout: false,
    routes: [
      {
        path: '/admin',
        routes: [
          {
            name: 'login',
            path: '/admin/login',
            component: './admin/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/admin1',
    name: 'admin',
    icon: 'crown',
    // access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin1/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './TableList',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    name: 'order-manage',
    icon: 'smile',
    path: '/order-manage',
    component: './OrderManage',
  },
  {
    name: 'goods',
    icon: 'smile',
    path: '/goods',
    // component: './OrderManage',
    routes: [
      {
        name: 'goods-manage',
        icon: 'smile',
        path: '/goods/goods-manage',
        component: './goods/GoodsManage',
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
