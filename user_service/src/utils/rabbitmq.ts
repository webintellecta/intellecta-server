// import * as amqplib from "amqplib";
// import { Connection, Channel, ConsumeMessage } from "amqplib";

// const RABBITMQ_URL = "amqps://gdtwxeui:3UnJrv2d5M1lHN4Ro9TZ8FFI2BDO6M86@leopard.lmq.cloudamqp.com/gdtwxeui";

// let connection: Connection | null = null;
// async function getConnection(): Promise<Connection> {
//   if (connection) return connection;

//   try {
//     console.log("🔄 Connecting to RabbitMQ...");
//     connection = await amqplib.connect(RABBITMQ_URL);
//     console.log("✅ Connected to RabbitMQ!");

//     connection.on('close', () => {
//       console.error("❌ RabbitMQ connection closed.");
//       connection = null;
//     });

//     connection.on('error', (err) => {
//       console.error("❌ RabbitMQ connection error:", err);
//       connection = null;
//     });

//     return connection;
//   } catch (error) {
//     console.error("❌ RabbitMQ Connection Error:", error);
//     throw error;
//   }
// }

// /**
//  * Create a new channel from the existing connection
//  */
// async function createChannel(): Promise<Channel> {
//   const conn = await getConnection();
//   return conn.createChannel();
// }

// /**
//  * Publishes a message to the specified queue
//  */
// export async function publishToQueue(queue: string, data: any): Promise<void> {
//   const channel = await createChannel();
//   try {
//     await channel.assertQueue(queue, { durable: true });

//     let message;

//     if (data instanceof Map) {
//       // Convert Map to plain object
//       message = {
//         _id: data.get("_id")?.toString() || "",
//         name: data.get("name") || "Unknown",
//         email: data.get("email") || "Unknown",
//         age: data.get("age") || null,
//         phone: data.get("phone") || "Unknown",
//         role: data.get("role") || "Unknown",
//         profilePic: data.get("profilePic") || "",
//         createdAt: data.get("createdAt")
//           ? new Date(data.get("createdAt")).toISOString()
//           : null,
//         updatedAt: data.get("updatedAt")
//           ? new Date(data.get("updatedAt")).toISOString()
//           : null,
//       };
//     } else {
//       message = data;
//     }

//     channel.sendToQueue(queue, Buffer.from(JSON.stringify(message), "utf-8"));
//     console.log(`📤 Message sent to queue "${queue}"`);
//   } catch (error) {
//     console.error("❌ RabbitMQ Publish Error:", error);
//     throw error;
//   } finally {
//     await channel.close();
//   }
// }

// /**
//  * Consumes messages from the queue and handles them via the provided callback
//  */
// export async function consumeFromQueue(
//   queue: string,
//   callback: (data: any, msg: ConsumeMessage) => Promise<void>
// ): Promise<void> {
//   const channel = await createChannel();
//   await channel.assertQueue(queue, { durable: true });
//   channel.prefetch(1);
//   console.log(`📥 Waiting for messages in queue: ${queue}...`);

//   channel.consume(
//     queue,
//     async (msg: ConsumeMessage | null) => {
//       if (msg) {
//         const data = JSON.parse(msg.content.toString());
//         console.log(`📩 Received message:`, data);

//         try {
//           await callback(data, msg);
//           channel.ack(msg);
//         } catch (error) {
//           console.error("❌ Error processing message:", error);
//         }
//       }
//     },
//     { noAck: false }
//   );
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
    });

    connection.on("error", (err) => {
      console.error("❌ RabbitMQ connection error:", err);
      connection = null;
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

export async function publishToQueue(queue: string, data: any): Promise<void> {
  const channel = await getPublishChannel();
  try {
    await channel.assertQueue(queue, { durable: true });

    const message = data instanceof Map
      ? {
          _id: data.get("_id")?.toString() || "",
          name: data.get("name") || "Unknown",
          email: data.get("email") || "Unknown",
          age: data.get("age") || null,
          phone: data.get("phone") || "Unknown",
          role: data.get("role") || "Unknown",
          profilePic: data.get("profilePic") || "",
          createdAt: data.get("createdAt") ? new Date(data.get("createdAt")).toISOString() : null,
          updatedAt: data.get("updatedAt") ? new Date(data.get("updatedAt")).toISOString() : null,
        }
      : data;

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message), "utf-8"));
    console.log(`📤 Message sent to queue "${queue}"`);
  } catch (error) {
    console.error("❌ RabbitMQ Publish Error:", error);
    throw error;
  }
}

export async function consumeFromQueue(
  queue: string,
  callback: (data: any, msg: ConsumeMessage) => Promise<void>
): Promise<void> {
  const channel = await getConsumeChannel();
  await channel.assertQueue(queue, { durable: true });
  channel.prefetch(1);

  console.log(`📥 Waiting for messages in queue: ${queue}...`);

  channel.consume(
    queue,
    async (msg: ConsumeMessage | null) => {
      if (msg) {
        const data = JSON.parse(msg.content.toString());
        console.log(`📩 Received message:`, data);

        try {
          await callback(data, msg);
          channel.ack(msg);
        } catch (error) {
          console.error("❌ Error processing message:", error);
        }
      }
    },
    { noAck: false }
  );
}
