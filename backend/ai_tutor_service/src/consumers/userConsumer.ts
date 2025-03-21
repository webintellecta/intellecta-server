import { consumeFromQueue } from "../utils/rabbitmq";

async function startConsumer() {
    console.log("Initializing RabbitMQ consumer...");
    await consumeFromQueue("user_fetched", async (data) => {
      console.log("AI Tutor Service received user_fetched event:", data);
    });
  }
  
  startConsumer().catch((err) => console.error("Failed to start consumer:", err));
  console.log("Server is running on port 5000");