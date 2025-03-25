import { consumeFromQueue } from "../utils/rabbitmq";

const userCache = new Map<string, any>();

async function startConsumer() {
    console.log("Initializing RabbitMQ consumer...");
    await consumeFromQueue("user_fetched", async (data) => {
      console.log("AI Tutor Service received user_fetched event:", data);

      if (data?.user) {
        userCache.set(data.user.id, {
                id: data.user.id,
                age: data.age 
        });     
    }
    });
  }
  
  startConsumer().catch((err) => console.error("Failed to start consumer:", err));
  console.log("Server is running on port 5001");

  export { userCache };