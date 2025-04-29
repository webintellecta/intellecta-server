"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVICES = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const logServiceUrls = () => {
    console.log("Service URLs being used:");
    console.log(`User Service: ${process.env.USER_SERVICE || "http://user-service:5000"}`);
    console.log(`AI Tutor Service: ${process.env.AI_TUTOR_SERVICE || "http://ai-tutor-service:5001"}`);
    console.log(`Game Service: ${process.env.GAME_SERVICE || "http://game-service:5002"}`);
    console.log(`Ai chatbot Service: ${process.env.AI_CHATBOT_SERVICE || "http://ai_chatbot_service:5004"}`);
    console.log(`Content Service: ${process.env.CONTENT_SERVICE || "http://content_service:5005"}`);
    console.log(`Admin Service: ${process.env.ADMIN_SERVICE || "http://admin_service:5006"}`);
    console.log(`Notification Service: ${process.env.NOTIFICATION_SERVICE || "http://notification_service:5008"}`);
};
logServiceUrls();
exports.SERVICES = {
    user: process.env.USER_SERVICE || "http://user-service:5000",
    aiTutor: process.env.AI_TUTOR_SERVICE || "http://ai-tutor-service:5001",
    game: process.env.GAME_SERVICE || "http://game-service:5002",
    chatbot: process.env.AI_CHATBOT_SERVICE || "http://ai_chatbot_service:5004",
    content: process.env.CONTENT_SERVICE || "http://content_service:5005",
    admin: process.env.ADMIN_SERVICE || "http://admin_service:5006",
    notification: process.env.NOTIFICATION_SERVICE || "http://notification_service:5008",
};
