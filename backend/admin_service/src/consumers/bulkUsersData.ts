import { consumeFromQueue } from "../utils/rabbitmq/rabbitmqConsumer"; 

const bulkUsersCache = new Map<string, any>();

async function startConsumer() {
  console.log("Initializing RabbitMQ consumer...");

  // ✅ Listen to the response queue (where the user-service sends details)
  await consumeFromQueue("userData", async (users) => {
    if (users && Array.isArray(users)) {
      // Store by userId for quick lookup
      users.forEach((user) => {
        bulkUsersCache.set(user._id.toString(), user);
      });

      console.log("✅ Fetched and cached bulk user details:", users);
    } else {
      console.warn("⚠️ Invalid users data received:", users);
    }
  });
}

startConsumer().catch((err) =>
  console.error("Failed to start bulk users consumer:", err)
);

export default bulkUsersCache;
