"use strict";

const amqp = require("amqplib");

async function consumerOrderedMessage() {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();

    const queueName = "ordered-queue-message";
    await channel.assertQueue(queueName, {
      durable: true,
    });

    // set prefetch to 1 to make sure that a worker only receives one message at a time
    channel.prefetch(1);

    channel.consume(queueName, (msg) => {
      const message = msg.content.toString();

      setTimeout(() => {
        console.log(`Message received: ${message}`);
        channel.ack(msg);
      }, Math.random() * 1000);
    });
  } catch (error) {
    console.error(error);
  }
}

consumerOrderedMessage().catch((error) => console.error(error));
