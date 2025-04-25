import * as amqplib from "amqplib";
import { Channel, ConsumeMessage } from "amqplib";

const RABBITMQ_URL = "amqps://gdtwxeui:3UnJrv2d5M1lHN4Ro9TZ8FFI2BDO6M86@leopard.lmq.cloudamqp.com/gdtwxeui";

export async function consumeFromQueue(queue: string, callback: (message: any) => void): Promise<void> {
  try {
    const connection = await amqplib.connect(RABBITMQ_URL);
    const channel: Channel = await connection.createChannel();
    
    await channel.assertQueue(queue, { durable: true });

    console.log(`📥 Waiting for messages in queue: ${queue}...`);

    channel.consume(queue, (msg: ConsumeMessage | null) => {
      if (msg) {
        try {
          console.log("🟢 Raw message received:", msg.content.toString("utf-8"));
          const data = JSON.parse(msg.content.toString("utf-8"));
          callback(data);
          channel.ack(msg); // ✅ Acknowledge safely
        } catch (err) {
          console.error("❌ Error processing message:", err);
          // Optional: channel.nack(msg); // requeue if needed
        }
      }
    }, { noAck: false }); // ✅ Required if calling channel.ack
  } catch (error) {
    console.error("RabbitMQ Consumer Error:", error);
  }
}