import { consumeFromQueue } from "../utils/rabbitmq/rabbitmqConsumer"; 

const userProgressCache = new Map<string, any>();

async function startConsumer() {
    console.log("Initializing RabbitMQ consumer...");
  
    await consumeFromQueue("userProgressData", async (data) => {        
        if (data) {            
            userProgressCache.set(data._id, data);
        }
    });
}

startConsumer().catch((err) => console.error("Failed to start consumer:", err));

export default userProgressCache