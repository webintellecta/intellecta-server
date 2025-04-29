import * as amqplib from 'amqplib';

const RABBITMQ_URL = "amqps://gdtwxeui:3UnJrv2d5M1lHN4Ro9TZ8FFI2BDO6M86@leopard.lmq.cloudamqp.com/gdtwxeui";


import { Connection, Channel } from 'amqplib';


// Declare connection and channel with correct types
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

export async function publishToQueue(queue: string, message: any): Promise<void> {
  try {
    // Ensure RabbitMQ is connected
    await connectToRabbitMQ();

    if (!channel) throw new Error("Channel is not initialized");

    // Assert queue (ensure it exists)
    await channel.assertQueue(queue, { durable: true }); // Durable queue: survives server restart

    // Send message to the queue
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log(`Published message to queue: ${queue}`);
  } catch (error) {
    console.error("RabbitMQ Publish Error:", error);
    throw error;
  }
}