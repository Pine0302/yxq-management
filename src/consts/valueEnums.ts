/** 订单状态 */
const orderStatusValueEnum = {
  CANCELED: {
    text: '已取消',
    status: 'Warning',
  },
  WAIT_PAY: {
    text: '待支付',
    status: 'Error',
  },
  MAKING: {
    text: '制作中',
    status: 'Processing',
  },
  ON_THE_WAY: {
    text: '配送中',
    status: 'Default',
  },
  ARRIVED: {
    text: '已送达',
    status: 'Success',
  },
  COMMENTED: {
    text: '已评价',
    status: 'purple',
  },
};

/** 支付状态 */
const payStatusValueEnum = {
  WAIT_PAY: {
    text: '待支付',
    status: 'Warning',
  },
  PAY_SUCCESS: {
    text: '支付成功',
    status: 'Success',
  },
  PAY_FAIL: {
    text: '支付失败',
    status: 'Error',
  },
  RETURN_MONEY: {
    text: '退款中',
    status: 'Processing',
  },
  RETURN_MONEY_SUCCESS: {
    text: '退款成功',
    color: 'purple',
  },
};

/** 支付方式 */
const payPlatformValueEnum = {
  wx_jsapi: {
    text: '公众号/小程序（微信）',
    status: 'Success',
  },
  wx_app: {
    text: 'APP（微信）',
    status: 'Success'
  }
};

/** 早/中/晚餐 */
const dishTypeValueEnum = {
  BREAKFAST: {
    text: '早餐',
    status: 'Default',
  },
  LUNCH: {
    text: '中餐',
    status: 'Success',
  },
  DINNER: {
    text: '晚餐',
    status: 'purple',
  },
};

export { orderStatusValueEnum, payStatusValueEnum, payPlatformValueEnum, dishTypeValueEnum };
