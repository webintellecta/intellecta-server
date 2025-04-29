"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.publishToQueue = publishToQueue;
exports.consumeFromQueue = consumeFromQueue;
const amqplib = __importStar(require("amqplib"));
const RABBITMQ_URL = "amqps://gdtwxeui:3UnJrv2d5M1lHN4Ro9TZ8FFI2BDO6M86@leopard.lmq.cloudamqp.com/gdtwxeui";
let connection = null;
function getConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        if (connection)
            return connection;
        try {
            console.log("🔄 Connecting to RabbitMQ...");
            connection = yield amqplib.connect(RABBITMQ_URL);
            console.log("✅ Connected to RabbitMQ!");
            connection.on('close', () => {
                console.error("❌ RabbitMQ connection closed.");
                connection = null;
            });
            connection.on('error', (err) => {
                console.error("❌ RabbitMQ connection error:", err);
                connection = null;
            });
            return connection;
        }
        catch (error) {
            console.error("❌ RabbitMQ Connection Error:", error);
            throw error;
        }
    });
}
/**
 * Create a new channel from the existing connection
 */
function createChannel() {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield getConnection();
        return conn.createChannel();
    });
}
/**
 * Publishes a message to the specified queue
 */
function publishToQueue(queue, data) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const channel = yield createChannel();
        try {
            yield channel.assertQueue(queue, { durable: true });
            let message;
            if (data instanceof Map) {
                // Convert Map to plain object
                message = {
                    _id: ((_a = data.get("_id")) === null || _a === void 0 ? void 0 : _a.toString()) || "",
                    name: data.get("name") || "Unknown",
                    email: data.get("email") || "Unknown",
                    age: data.get("age") || null,
                    phone: data.get("phone") || "Unknown",
                    role: data.get("role") || "Unknown",
                    profilePic: data.get("profilePic") || "",
                    createdAt: data.get("createdAt")
                        ? new Date(data.get("createdAt")).toISOString()
                        : null,
                    updatedAt: data.get("updatedAt")
                        ? new Date(data.get("updatedAt")).toISOString()
                        : null,
                };
            }
            else {
                message = data;
            }
            channel.sendToQueue(queue, Buffer.from(JSON.stringify(message), "utf-8"));
            console.log(`📤 Message sent to queue "${queue}"`);
        }
        catch (error) {
            console.error("❌ RabbitMQ Publish Error:", error);
            throw error;
        }
        finally {
            yield channel.close();
        }
    });
}
/**
 * Consumes messages from the queue and handles them via the provided callback
 */
function consumeFromQueue(queue, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const channel = yield createChannel();
        yield channel.assertQueue(queue, { durable: true });
        channel.prefetch(1);
        console.log(`📥 Waiting for messages in queue: ${queue}...`);
        channel.consume(queue, (msg) => __awaiter(this, void 0, void 0, function* () {
            if (msg) {
                const data = JSON.parse(msg.content.toString());
                console.log(`📩 Received message:`, data);
                try {
                    yield callback(data, msg);
                    channel.ack(msg);
                }
                catch (error) {
                    console.error("❌ Error processing message:", error);
                }
            }
        }), { noAck: false });
    });
}
