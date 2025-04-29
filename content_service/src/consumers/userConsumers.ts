import { consumeFromQueue } from "../utils/rabbitmq/rabbitmqConsumer";

const userCache: Record<string, any> = {};

// Function to start the RabbitMQ consumer to listen for user data
async function startConsumer() {
    console.log("Initializing RabbitMQ consumer...");

    await consumeFromQueue("userData", async (data) => {
        if (data && data._id) {
            // Cache user data using user._id as the key
            userCache[data._id] = data;
            console.log("User data cached:", data._id);
        }
    });
}

// Start the consumer
startConsumer().catch((err) => console.error("Failed to start consumer:", err));

// Function to get user data from the cache
export function getUserData(userId: string) {
    return new Promise((resolve, reject) => {
        const timeout = 5000; // Set a timeout for retrying
        const startTime = Date.now();

        const checkCache = () => {
            if (userCache[userId]) {
                resolve(userCache[userId]);
            } else if (Date.now() - startTime > timeout) {
                reject(new Error("Timeout: User data not found in cache."));
            } else {
                setTimeout(checkCache, 500); // Retry after 500ms
            }
        };

        checkCache();
    });
}

export { userCache };
