import amqp from "amqplib";
import ApiError from "../utils/ApiError.js";

let connection, channel;

export const connect = async () => {
  try {
    connection = await amqp.connect(process.env.RABBIT_URL);
    channel = await connection.createChannel();
    console.log("customer micro-service rabbit connected successfully...");
  } catch (error) {
    throw new ApiError(
      500,
      "Rabbit connection error...",
      "Rabbit connection error..."
    );
  }
};

export const subscribeToQueue=async(queueName,callback)=>{
    if(!channel){
        await connect();
    }
    await channel.assertQueue(queueName);
    channel.consume(queueName,async(message)=>{
        await callback(message.content.toString(),message, channel);
    })
}


export const publishToQueue = async (queue, message) => {
  if (!channel) await connect();

  const correlationId = generateUuid();
  const replyQueue = await channel.assertQueue("", { exclusive: true });

  return new Promise((resolve, reject) => {
    channel.consume(
      replyQueue.queue,
      (msg) => {
        if (msg.properties.correlationId === correlationId) {
          const content = JSON.parse(msg.content.toString());
          resolve(content);
        }
      },
      { noAck: true }
    );

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      replyTo: replyQueue.queue,
      correlationId,
    });
  });
};

const generateUuid = () => {
  return Math.random().toString() + Math.random().toString() + Math.random().toString();
};
