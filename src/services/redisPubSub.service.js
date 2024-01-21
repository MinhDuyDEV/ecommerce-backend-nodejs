"use strict";

const Redis = require("redis");

class RedisPubSubService {
  constructor() {
    this.subscriber = Redis.createClient();
    this.public = Redis.createClient();
  }

  public(channel, message) {
    return new Promise((resolve, reject) => {
      this.public(channel, message, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  subscriber(channel, callback) {
    this.subscriber.subscriber(channel);
    this.subscriber.on("message", (subscriberChannel, message) => {
      if (channel === subscriberChannel) {
        callback(channel, message);
      }
    });
  }
}

module.exports = new RedisPubSubService();
