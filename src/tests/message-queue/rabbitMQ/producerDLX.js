const amqp = require("amqplib");

const msg = "Hello World!";

const log = console.log;

console.log = function () {
  log.apply(console, [new Date()].concat(arguments));
};

const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();

    const notificationExchange = "notification-exchange"; //notification direct exchange
    const notificationQueue = "notification-queue-process"; // assert notification queue
    const notificationExchangeDLX = "notification-exchange-DLX"; //notification direct exchange DLX
    const notificationRoutingKeyDLX = "notification-routing-key-DLX"; // assert notification queue DLX

    // 1. create exchange
    await channel.assertExchange(notificationExchange, "direct", {
      durable: true,
    });
    // 2. create queue
    const queueResult = await channel.assertQueue(notificationQueue, {
      exclusive: false, // cho phep cac ket noi try cap vao hang doi cung mot luc
      deadLetterExchange: notificationExchangeDLX,
      deadLetterRoutingKey: notificationRoutingKeyDLX,
    });
    // 3. bind queue to exchange
    await channel.bindQueue(queueResult.queue, notificationExchange);
    // 4. send message to consumer queue
    const msg = "a new product has been created";
    console.log(`Message sent: ${msg}`);
    await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
      expiration: 10000, // 10s
    });
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error(error);
  }
};
runProducer().catch(console.error);
