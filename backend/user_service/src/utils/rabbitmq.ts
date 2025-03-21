import amqplib from "amqplib";

const RABBITMQ_URL = "amqp://admin:password@rabbitmq:5672";

export async function publishToQueue(queue: string, message: any) {
    try {
        const connection = await amqplib.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue(queue);
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        console.log(`Message sent to queue ${queue}`);
        setTimeout(() => connection.close(), 500);
    } catch (error) {
        console.error("RabbitMQ Publish Error:", error);
    }
}

export async function consumeFromQueue(queue: string, callback: (message: any) => void) {
    try {
        const connection = await amqplib.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue(queue);

        console.log(`Waiting for messages in ${queue}...`);

        channel.consume(queue, (message) => {
            if (message) {
                const data = JSON.parse(message.content.toString());
                callback(data);
                channel.ack(message);
            }
        });
    } catch (error) {
        console.error("RabbitMQ Consume Error:", error);
    }
}
