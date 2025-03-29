import dotenv from "dotenv";

dotenv.config();

export const SERVICES = {
    user: process.env.USER_SERVICE || "http://localhost:5000",
    aiTutor: process.env.AI_TUTOR_SERVICE || "http://localhost:5001",
    game: process.env.GAME_SERVICE || "http://localhost:5002",
    aiChatBot: process.env.AI_CHATBOT_SERVICE || "http://localhost:5004",
    content: process.env.COURSE_SERVICE || "http://localhost:5005",
};
