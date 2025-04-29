import User from "../models/userModel";
import { consumeFromQueue, publishToQueue } from "../utils/rabbitmq";

// currentUser is now a plain object to be consistent with the expected format
let currentUser: Record<string, any> | null = null;

async function startConsumer() {
    console.log("Initializing RabbitMQ consumer...");
    
    await consumeFromQueue("user_id", async (data) => {
        console.log("User consumer received the message", data);

        if (data) {
            console.log("Data received for user fetch:", data);

            try {
                // Fetch user from the database
                const user = await User.findById(data);

                if (user) {
                    // Convert user object to plain object and assign it to currentUser
                    currentUser = user.toObject();
                    console.log("User found:", currentUser);
                    
                    // Publish the user data to the queue
                    await publishToQueue("userData", currentUser);
                } else {
                    // If user is not found, reset currentUser to null
                    currentUser = null;
                    console.warn("User not found for ID:", data);
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
                currentUser = null;
            }
        } else {
            console.warn("Received empty or invalid data for user fetch.");
        }
    });
}

startConsumer().catch((err) => console.error("Failed to start consumer:", err));

// Export the currentUser object for use in other parts of the app
export { currentUser };
