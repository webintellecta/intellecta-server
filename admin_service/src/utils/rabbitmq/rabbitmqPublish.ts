// import * as amqplib from 'amqplib';

// import { Connection, Channel } from 'amqplib';

// const RABBITMQ_URL = "amqps://gdtwxeui:3UnJrv2d5M1lHN4Ro9TZ8FFI2BDO6M86@leopard.lmq.cloudamqp.com/gdtwxeui";

// // Declare connection and channel with correct types
// let connection: Connection | null = null;
// let channel: Channel | null = null;
// async function connectToRabbitMQ(): Promise<void> {
//   if (connection && channel) return; // Already connected

//   try {
//     console.log("Connecting to RabbitMQ...");
    
//     // Ensure the connection is typed correctly
//     connection = await amqplib.connect(RABBITMQ_URL || 'amqp://localhost');
    
//     // The connection object is of type 'Connection', so we can safely call 'createChannel' here
//     channel = await connection.createChannel();
//     console.log("Connected to RabbitMQ!");

//     // Handling unexpected connection closure
//     connection.on('close', () => {
//       console.error("RabbitMQ connection closed!");
//       connection = null;
//       channel = null;
//     });

//     connection.on('error', (err) => {
//       console.error("RabbitMQ connection error!", err);
//       connection = null;
//       channel = null;
//     });

//   } catch (error) {
//     console.error("RabbitMQ Connection Error:", error);
//     throw error;
//   }
// }

// export async function publishToQueue(queue: string, message: any): Promise<void> {
//   try {
//     // Ensure RabbitMQ is connected
//     await connectToRabbitMQ();

//     if (!channel) throw new Error("Channel is not initialized");

//     // Assert queue (ensure it exists)
//     await channel.assertQueue(queue, { durable: true }); // Durable queue: survives server restart

//     // Send message to the queue
//     channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
//     console.log(`Published message to queue: ${queue}`);
//   } catch (error) {
//     console.error("RabbitMQ Publish Error:", error);
//     throw error;
//   }
// }


import * as amqplib from "amqplib";
import { Connection, Channel, ConsumeMessage } from "amqplib";

const RABBITMQ_URL = "amqps://gdtwxeui:3UnJrv2d5M1lHN4Ro9TZ8FFI2BDO6M86@leopard.lmq.cloudamqp.com/gdtwxeui";

let connection: Connection | null = null;
let publishChannel: Channel | null = null;
let consumeChannel: Channel | null = null;

async function getConnection(): Promise<Connection> {
  if (connection) return connection;

  try {
    console.log("🔄 Connecting to RabbitMQ...");
    connection = await amqplib.connect(RABBITMQ_URL);
    console.log("✅ Connected to RabbitMQ!");

    connection.on("close", () => {
      console.error("❌ RabbitMQ connection closed.");
      connection = null;
      publishChannel = null;
      consumeChannel = null;
    });

    connection.on("error", (err) => {
      console.error("❌ RabbitMQ connection error:", err);
      connection = null;
      publishChannel = null;
      consumeChannel = null;
    });

    return connection;
  } catch (error) {
    console.error("❌ RabbitMQ Connection Error:", error);
    throw error;
  }
}

async function getPublishChannel(): Promise<Channel> {
  if (!publishChannel) {
    const conn = await getConnection();
    publishChannel = await conn.createChannel();
  }
  return publishChannel;
}

async function getConsumeChannel(): Promise<Channel> {
  if (!consumeChannel) {
    const conn = await getConnection();
    consumeChannel = await conn.createChannel();
  }
  return consumeChannel;
}

export async function publishToQueue(queue: string, message: any): Promise<void> {
  try {
    const channel = await getPublishChannel();
    await channel.assertQueue(queue, { durable: true });

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message), "utf-8"));
    console.log(`📤 Published message to queue: ${queue}`);
  } catch (error) {
    console.error("❌ RabbitMQ Publish Error:", error);
    throw error;
  }
}

export async function consumeFromQueue(queue: string, callback: (message: any) => void): Promise<void> {
  try {
    const channel = await getConsumeChannel();
    await channel.assertQueue(queue, { durable: true });
    channel.prefetch(1);

    console.log(`📥 Waiting for messages in queue: ${queue}...`);

    channel.consume(
      queue,
      (msg: ConsumeMessage | null) => {
        if (msg) {
          try {
            const data = JSON.parse(msg.content.toString("utf-8"));
            console.log("🟢 Message received:", data);
            callback(data);
            channel.ack(msg);
          } catch (err) {
            console.error("❌ Error processing message:", err);
          }
        }
      },
      { noAck: false }
    );
  } catch (error) {
    console.error("❌ RabbitMQ Consumer Error:", error);
  }
}
