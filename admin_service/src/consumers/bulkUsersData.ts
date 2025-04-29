import { consumeFromQueue } from "../utils/rabbitmq/rabbitmqConsumer"; 

const bulkUsersCache = new Map<string, any>();

// A function to start the consumer and return a Promise when caching is done
async function startConsumer(): Promise<void> {
  console.log("Initializing RabbitMQ consumer...");

  await consumeFromQueue("bulkUsersData", async (users) => {
    console.log("Received user data for caching:", users);
  
    if (users && Array.isArray(users)) {
      users.forEach((user) => {
        bulkUsersCache.set(user._id.toString(), user);
      });
      console.log("Cached users:", bulkUsersCache);
    } else {
      console.warn("Invalid user data received:", users);
    }
  });
  
}

startConsumer()
  .catch((err) => console.error("Failed to start bulk users consumer:", err));

export default bulkUsersCache;
