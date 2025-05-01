import * as amqplib from "amqplib";
import { Connection, Channel, ConsumeMessage } from "amqplib";

const RABBITMQ_URL = "amqps://gdtwxeui:3UnJrv2d5M1lHN4Ro9TZ8FFI2BDO6M86@leopard.lmq.cloudamqp.com/gdtwxeui";

let connection: Connection | null = null;
let channel: Channel | null = null;


async function connectToRabbitMQ(): Promise<void> {
  if (connection && channel) return; // Already connected

  try {
    console.log("Connecting to RabbitMQ...");
    
    // Ensure the connection is typed correctly
    connection = await amqplib.connect(RABBITMQ_URL);
    
    // The connection object is of type 'Connection', so we can safely call 'createChannel' here
    channel = await connection.createChannel();
    console.log("Connected to RabbitMQ!");

    // Handling unexpected connection closure
    connection.on('close', () => {
      console.error("RabbitMQ connection closed!");
      connection = null;
      channel = null;
    });

    connection.on('error', (err) => {
      console.error("RabbitMQ connection error!", err);
      connection = null;
      channel = null;
    });

  } catch (error) {
    console.error("RabbitMQ Connection Error:", error);
    throw error;
  }
}



export async function consumeFromQueue(queue: string, callback: (message: any) => void): Promise<void> {
  try {
    await connectToRabbitMQ();
    if (!channel) throw new Error("Channel is not initialized");
    
    await channel.assertQueue(queue);
    
    channel.consume(queue, (msg: ConsumeMessage | null) => {
      if (msg) {
        const data = JSON.parse(msg.content.toString("utf-8"));
        callback(data);
        channel?.ack(msg);
      }
    });
  } catch (error) {
    console.error("RabbitMQ Consumer Error:", error);
  }
}
