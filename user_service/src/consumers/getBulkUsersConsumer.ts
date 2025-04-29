import User from "../models/userModel";
import { consumeFromQueue, publishToQueue } from "../utils/rabbitmq";

async function startConsumer() {
  console.log("Initializing RabbitMQ consumer...");
  await consumeFromQueue("fetchBulkUserDetails", async (data) => {
    console.log("User service received request for user details:", data);
  
    try {
      const { userIds } = data;
      const users = await User.find({ _id: { $in: userIds } }, { password: 0 }).lean();
      console.log("Fetched users:", users); // Log the fetched users
  
      if (users && users.length > 0) {
        console.log("Sending user details to admin service via bulkUsersData queue");
        await publishToQueue("bulkUsersData", users);
      } else {
        console.warn("No users found, sending empty array.");
        await publishToQueue("bulkUsersData", []);
      }
    } catch (error) {
      console.error("Error fetching user details by userIds:", error);
      await publishToQueue("bulkUsersData", []);
    }
  });
  
}

startConsumer().catch((err) => console.error("Failed to start consumer:", err));
