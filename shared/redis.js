import Redis from 'ioredis';
export const redisPub = new Redis(); // Redis publisher
export const redisSub = new Redis(); // Redis subscriber
export const redis = new Redis(); // Redis common
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

export const redisRoundRobin = async (key, size) => {
  const rrKey = `${key}_RR`
  const getReturnValue = (curIndex) => {
    return {
      pattern: key,
      rrPattern: `${key}_RR`,
      rrIndex,
      servicePattern: `${key}_${curIndex}`
    }
  }
  const rrIndex = JSON.parse(await redis.get(`${key}_RR`)) || 1
  if (size === rrIndex) {
    await redis.set(rrKey, JSON.stringify(1))

    return getReturnValue(rrIndex)
  }
  await redis.set(rrKey, JSON.stringify(rrIndex + 1))
  return getReturnValue(rrIndex)
}



export class RedisPSSP {
  constructor(pubCon, subCon) {
    this.sub = new Redis(subCon ? subCon : undefined)
    this.pub = new Redis(pubCon ? pubCon : undefined)
    this.rr = new Redis(pubCon ? pubCon : undefined)
  }
  private redisFollow(channel, id) {
    const replyChannel = `${channel}:reply`;
    return new Promise((resolve, reject) => {
      this.sub.subscribe(replyChannel, (err, count) => {
        if (err) {
          console.error('Failed to subscribe: ', err.message);
          return reject({
            message: err.message,
          });
        }
        console.log(`Subscribed to ${count} channel(s). Waiting for message...`);
      });
      this.sub.on('message', (chan, message) => {
        const msg = JSON.parse(message);
        if (chan === replyChannel && msg.id === id) {
          console.log(`Received data from ${chan}:${id}`);
          return resolve(msg.data);
          return this.sub.unsubscribe(chan);
        }
        // reject({
        //   message: 'No response from service',
        // });
      });
    });
  };

  async redisPubSub(channel, payload = {}) {
    const id = uuidv4();
    try {
      await this.pub.publish(channel, JSON.stringify({ data: payload, id }));
      const data = await redisFollow(channel, id);

      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  };


  async redisSubPub(channel, cb) {
    try {
      this.sub.subscribe(channel, () => {
        console.log('Products Service subscribed to ' + channel);
      });

      this.sub.on('message', (chan, message) => {
        if (channel === chan) {
          const event = JSON.parse(message);
          console.log('Received event:', event);

          cb(event.data, async function reply(replyData = {}) {
            try {
              await this.pub.publish(
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

  async redisRoundRobin(key, size) {
    const rrKey = `${key}_RR`
    const getReturnValue = (curIndex) => {
      return {
        pattern: key,
        rrPattern: `${key}_RR`,
        rrIndex,
        servicePattern: `${key}_${curIndex}`
      }
    }
    const rrIndex = JSON.parse(await redis.get(`${key}_RR`)) || 1
    if (size === rrIndex) {
      await this.rr.set(rrKey, JSON.stringify(1))

      return getReturnValue(rrIndex)
    }
    await this.rr.set(rrKey, JSON.stringify(rrIndex + 1))
    return getReturnValue(rrIndex)
  }
}