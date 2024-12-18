import Redis from 'ioredis';
import { getGateWayPatterns, PRODUCT_CHANNEL, PRODUCT_SERVICES_SIZE, PRODUCTS_PATTERN } from '../../shared/patterns.js';
import { redisPub, redisSub, redisSubPub } from '../../shared/redis.js';

// let products = [];
const key = 'products';
const gw = getGateWayPatterns(PRODUCTS_PATTERN, PRODUCT_SERVICES_SIZE)
const gateway = gw.getGateWay(2)

redisSubPub(gateway[PRODUCTS_PATTERN.GET_ALL_PRODUCTS], async (data, reply) => {
  const products = await redisPub.get(key);
  reply(JSON.parse(products));
});

redisSubPub(gateway[PRODUCTS_PATTERN.CREATE_PRODUCT], async (data, reply) => {
  const products = JSON.parse(await redisPub.get(key)) || [];
  products.push(data);
  redisPub.set(key, JSON.stringify(products));
  reply(data);
});

