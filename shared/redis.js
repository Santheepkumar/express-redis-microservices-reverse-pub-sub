import Redis from 'ioredis';
export const redisPub = new Redis(); // Redis publisher
export const redisSub = new Redis(); // Redis subscriber
import { v4 as uuidv4 } from 'uuid';

export const redisFollow = (channel, id) => {
  const replyChannel = `${channel}:reply`;
  return new Promise((resolve, reject) => {
    redisSub.subscribe(replyChannel, (err, count) => {
      if (err) {
        console.error('Failed to subscribe: ', err.message);
        return reject({
          message: err.message,
        });
      }
      console.log(`Subscribed to ${count} channel(s). Waiting for message...`);
    });
    redisSub.on('message', (chan, message) => {
      const msg = JSON.parse(message);
      if (chan === replyChannel && msg.id === id) {
        console.log(`Received data from ${chan}:${id}`);
        return resolve(msg.data);
        return redisSub.unsubscribe(chan);
      }
      // reject({
      //   message: 'No response from service',
      // });
    });
  });
};

export const redisPubSub = async (channel, payload = {}) => {
  const id = uuidv4();
  try {
    await redisPub.publish(channel, JSON.stringify({ data: payload, id }));
    const data = await redisFollow(channel, id);

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const redisSubPub = (channel, cb) => {
  try {
    redisSub.subscribe(channel, () => {
      console.log('Products Service subscribed to ' + channel);
    });

    redisSub.on('message', (chan, message) => {
      if (channel === chan) {
        const event = JSON.parse(message);
        console.log('Received event:', event);

        cb(event.data, async function reply(replyData = {}) {
          try {
            await redisPub.publish(
              `${channel}:reply`,
              JSON.stringify({
                data: replyData,
                id: event.id,
              })
            );
            console.log(
              'Replied to gateway',
              `Channel::${channel}:reply: ${event.id}`,
              `Message::${JSON.stringify(replyData)}`
            );
            return true;
          } catch (error) {
            return false;
          }
        });
      }
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const redis = new Redis();
