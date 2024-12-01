import Redis from 'ioredis';
import { ORDERS_PATTERN } from '../shared/patterns.js';
import { redisPub, redisSub, redisSubPub } from '../shared/redis.js';

let orders = [];

// Subscribe to product event
redisSubPub(ORDERS_PATTERN.GET_ALL_ORDERS, (data, reply) => {
  reply(products);
});

redisSubPub(ORDERS_PATTERN.CREATE_ORDER, (data, reply) => {
  orders.push(data);
  reply(data);
});
