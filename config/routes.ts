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
        // component: './Welcome',
      },
      {
        component: './404',
      },
    ],
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
        name: 'goods-class',
        icon: 'smile',
        path: '/goods/goods-class',
        component: './goods/GoodsClass',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'user',
    icon: 'smile',
    path: '/user',
    routes: [
      {
        name: 'user-manage',
        icon: 'smile',
        path: '/user/user-manage',
        component: './user/UserManage',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'biz',
    icon: 'smile',
    path: '/biz',
    routes: [
      {
        name: 'kitchen-manage',
        icon: 'smile',
        path: '/biz/kitchen-manage',
        component: './biz/KitchenManage',
      },
      {
        name: 'building-manage',
        icon: 'smile',
        path: '/biz/building-manage',
        component: './biz/BuildingManage',
      },
      {
        name: 'delivery-user',
        icon: 'smile',
        path: '/biz/delivery-user',
        component: './biz/DeliveryUser',
      },
      {
        name: 'kitchen-user',
        icon: 'smile',
        path: '/biz/kitchen-user',
        component: './biz/KitchenUser',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'marketing',
    icon: 'smile',
    path: '/marketing',
    routes: [
      {
        name: 'coupon',
        icon: 'smile',
        path: '/marketing/coupon',
        routes: [
          {
            name: 'coupon-manage',
            icon: 'smile',
            path: '/marketing/coupon/coupon-manage',
            component: './marketing/coupon/CouponManage',
          },
          {
            name: 'coupon-log',
            icon: 'smile',
            path: '/marketing/coupon/conpon-log',
            component: './marketing/coupon/CouponLog',
          },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'finance',
    icon: 'smile',
    path: '/finance',
    routes: [
      {
        component: './404',
      },
    ],
  },
  {
    name: 'system',
    icon: 'smile',
    path: '/system',
    routes: [
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
