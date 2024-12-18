import express from 'express';
import { redis, redisFollow, redisPub, redisPubSub } from '../shared/redis.js';
import {
  ORDERS_PATTERN,
  PRODUCT_CHANNEL,
  PRODUCTS_PATTERN,
} from '../shared/patterns.js';
import Redis from 'ioredis';

const app = express();

app.use(express.json());
// Routes
app.get('/products', async (req, res, next) => {
  try {
    const response = await redisPubSub(PRODUCTS_PATTERN.GET_ALL_PRODUCTS);
    return res.status(201).json({ message: 'products', response });
  } catch (error) {
    next(error);
  }
});

app.post('/products', async (req, res, next) => {
  const { name, price } = req.body;

  const newProduct = { id: Date.now(), name, price };

  try {
    const response = await redisPubSub(
      PRODUCTS_PATTERN.CREATE_PRODUCT,
      newProduct
    );
    return res.status(201).json({ message: 'Product added', response });
  } catch (error) {
    next(error);
  }
});

app.get('/orders', async (req, res, next) => {
  try {
    const response = await redisPubSub(ORDERS_PATTERN.GET_ALL_ORDERS);
    return res.status(201).json({ message: 'orders', response });
  } catch (error) {
    next(error);
  }
});

app.post('/orders', async (req, res, next) => {
  const { productId, quantity } = req.body;
  const newOrder = { id: Date.now(), productId, quantity };
  try {
    const response = await redisPubSub(ORDERS_PATTERN.CREATE_ORDER, newOrder);
    return res.status(201).json({ message: 'Order placed', response });
  } catch (error) {
    next(error);
  }
});


const rediss = new Redis();
const keysStream = rediss.scanStream();

keysStream.on("data", (resultKeys) => {
  console.log("Redis stream::keysStream: All active redis keys");
  for (let i = 0; i < resultKeys.length; i++) {
    console.log(resultKeys[i]);
  }
});


// Start Gateway
app.listen(3000, () => {
  console.log('Gateway Service running on port 3000');
});
