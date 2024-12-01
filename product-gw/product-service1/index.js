import Redis from 'ioredis';
import { PRODUCT_CHANNEL, PRODUCTS_PATTERN } from '../../shared/patterns.js';
import { redisPub, redisSub, redisSubPub } from '../../shared/redis.js';

// let products = [];
const key = 'products';

redisSubPub(`${PRODUCTS_PATTERN.GET_ALL_PRODUCTS}_X`, async (data, reply) => {
  const products = await redisPub.get(key);
  reply(JSON.parse(products));
});

redisSubPub(`${PRODUCTS_PATTERN.CREATE_PRODUCT}_X`, async (data, reply) => {
  const products = JSON.parse(await redisPub.get(key)) || [];
  products.push(data);
  redisPub.set(key, JSON.stringify(products));
  reply(data);
});
