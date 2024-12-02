import Redis from 'ioredis';
import { getGateWayPatterns, PRODUCT_CHANNEL, PRODUCT_SERVICES_SIZE, PRODUCTS_PATTERN } from '../shared/patterns.js';
import {
  redisPub,
  redisSub,
  redisSubPub,
  redisPubSub,
  redis,
  redisRoundRobin,
} from '../shared/redis.js';

redisSubPub(PRODUCTS_PATTERN.GET_ALL_PRODUCTS, async (data, reply) => {
  try {

    const rrData = await redisRoundRobin(PRODUCTS_PATTERN.GET_ALL_PRODUCTS, PRODUCT_SERVICES_SIZE)

    const response = await redisPubSub(
      rrData.servicePattern,
      data
    );

    reply(response);
  } catch (error) {
    console.log('Product Gateway Error', error);
  }
});

redisSubPub(PRODUCTS_PATTERN.CREATE_PRODUCT, async (data, reply) => {
  try {
    const rrData = await redisRoundRobin(PRODUCTS_PATTERN.CREATE_PRODUCT, PRODUCT_SERVICES_SIZE)
    const response = await redisPubSub(
      rrData.servicePattern,
      data
    );

    reply(response);
  } catch (error) {
    console.log('Product Gateway Error', error);
  }
});
