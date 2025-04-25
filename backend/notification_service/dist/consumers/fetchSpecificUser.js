"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserData = getUserData;
const rabbitmqConsumer_1 = require("../utils/rabbitmq/rabbitmqConsumer");
const specificUserData = new Map();
function startConsumer() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Initializing RabbitMQ consumer...");
        yield (0, rabbitmqConsumer_1.consumeFromQueue)("sendSpecificUser_NotificaitonService", (data) => __awaiter(this, void 0, void 0, function* () {
            if (data) {
                specificUserData.set(data._id, data);
                console.log("notification consumer received user_fetched event:", specificUserData);
            }
        }));
    });
}
startConsumer().catch((err) => console.error("Failed to start consumer:", err));
function getUserData(userId) {
    return new Promise((resolve, reject) => {
        const checkCache = () => {
            if (specificUserData.has(userId)) {
                resolve(specificUserData.get(userId));
            }
            else {
                setTimeout(checkCache, 500); // Retry after 500ms
            }
        };
        checkCache();
    });
}
