const amqp = require("amqplib");

const msg = "Hello World!";

const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    const queueName = "test-queue";
    await channel.assertQueue(queueName, { durable: true });
    // send message to consumer queue
    channel.sendToQueue(queueName, Buffer.from(msg));
    console.log(`Message sent: ${msg}`);
    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.error(error);
  }
};
runProducer().catch(console.error);
