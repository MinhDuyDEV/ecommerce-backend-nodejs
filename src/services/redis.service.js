"use strict";

// const redis = require("redis");
const { promisify } = require("util");
const { reservationInventory } = require("../services/inventory.service");
const client = require("../database/init.redis");
// const redisClient = redis.createClient();

// async function connectRedis() {
//   redisClient.on("error", (err) => console.log("Redis Client Error", err));
//   redisClient.on("connect", () => console.log("Connected to Redis"));
//   await redisClient.connect();
// }
// connectRedis();

const { instanceConnect: redisClient } = client.getRedis();

const pExpire = promisify(redisClient.pExpire).bind(redisClient);
const setNXAsync = promisify(redisClient.setNX).bind(redisClient);

const acquireLock = async (product_id, product_quantity, cart_id) => {
  const key = `lock_v2023_${product_id}`;
  const retryTimes = 10;
  const expireTime = 3000; // 3s timeout lock time
  for (let i = 0; i < retryTimes; i++) {
    // create key, who create key first, who go to checkout
    const result = await setNXAsync(key, expireTime);
    console.log(`result::`, result);
    if (result === 1) {
      // handle in inventory
      const isReservation = await reservationInventory({
        product_id,
        product_quantity,
        cart_id,
      });
      if (isReservation.modifiedCount) {
        await pExpire(key, expireTime);
        return key;
      }
      return null;
    } else {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 50);
      });
    }
  }
};

const releaseLock = async (keyLock) => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient);
  return delAsyncKey(keyLock);
};

module.exports = {
  acquireLock,
  releaseLock,
};
