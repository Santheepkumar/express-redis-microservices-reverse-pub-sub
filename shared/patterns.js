export const REPLY_PATTERN = 'reply';
export const PRODUCT_CHANNEL = 'product';
export const ORDER_CHANNEL = 'orders';


export const ORDERS_PATTERN = {
  GET_ALL_ORDERS: 'get.orders',
  CREATE_ORDER: 'create.orders',
};

export const PRODUCT_SERVICES_SIZE = 3
export const PRODUCTS_PATTERN = {
  GET_ALL_PRODUCTS: 'get.products',
  CREATE_PRODUCT: 'create.products',
};

export const getGateWayPatterns = (pats, size = 1) => {
  const patterns = {};
  Object.entries(pats).map(([key, value]) => {
    for (let index = 1; index <= size; index++) {
      patterns[`${key}_${index}`] = `${value}_${index}`;
    }
  });
  return {
    patterns,
    getGateWay: (gatewayNum) => {
      const gw = {}
      Object.entries(patterns).forEach(([key, value]) => {
        if (key.includes(gatewayNum)) {
          const originalValue = value.slice(0, -2)
          gw[originalValue] = patterns[key]
        }
      })
      return gw
    }
  }
};
