import Redis from 'ioredis';
import { PRODUCT_CHANNEL, PRODUCTS_PATTERN } from '../shared/patterns.js';
import {
  redisPub,
  redisSub,
  redisSubPub,
  redisPubSub,
} from '../shared/redis.js';

let rr1 = 'X';
redisSubPub(PRODUCTS_PATTERN.GET_ALL_PRODUCTS, async (data, reply) => {
  try {
    const response = await redisPubSub(
      `${PRODUCTS_PATTERN.GET_ALL_PRODUCTS}_${rr1}`,
      data
    );
    // Round robin
    rr1 = rr1 === 'X' ? 'Y' : 'X';
    console.log('Response', response);
    reply(response);
  } catch (error) {
    console.log('Product Gateway Error', error);
  }
});

let rr2 = 'X';
redisSubPub(PRODUCTS_PATTERN.CREATE_PRODUCT, async (data, reply) => {
  try {
    const response = await redisPubSub(
      `${PRODUCTS_PATTERN.CREATE_PRODUCT}_${rr2}`,
      data
    );
    // Round robin
    rr2 = rr2 === 'X' ? 'Y' : 'X';
    reply(response);
  } catch (error) {
    console.log('Product Gateway Error', error);
  }
});
