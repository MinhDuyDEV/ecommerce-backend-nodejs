const amqp = require("amqplib");

const runConsumer = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    const queueName = "test-queue";
    await channel.assertQueue(queueName, { durable: true });
    // send message to consumer queue
    channel.consume(
      queueName,
      (msg) => {
        console.log(`Message received: ${msg.content.toString()}`);
      },
      {
        noAck: true,
      }
    );
    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.error(error);
  }
};
runConsumer().catch(console.error);
