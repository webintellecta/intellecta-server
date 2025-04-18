import User from "../models/userModel";
import { consumeFromQueue, publishToQueue } from "../utils/rabbitmq";

async function startConsumer() {
  console.log("Initializing RabbitMQ consumer...");

  await consumeFromQueue("allUserDetailsNotification", async (data) => {
    console.log("User service received request for all users:", data);

    try {
      const users = await User.find({}, { password: 0 }); // Exclude sensitive fields
      console.log(users)
      if (users) {
        console.log("Sending user list to notification service");
        await publishToQueue("allUserDetailsNotification", users);
      } else {
        console.warn("No users found");
        await publishToQueue("allUserDetailsNotification", []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      await publishToQueue("allUserDetailsNotification", []);
    }
  });
}

startConsumer().catch((err) => console.error("Failed to start consumer:", err));
