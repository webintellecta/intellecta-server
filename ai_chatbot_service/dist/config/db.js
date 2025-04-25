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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const customErrorHandler_1 = __importDefault(require("../utils/customErrorHandler"));
dotenv_1.default.config();
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const CONNECTION_STRING = process.env.CONNECTION_STRING || "";
        if (!CONNECTION_STRING) {
            throw new customErrorHandler_1.default("connection string not found", 404);
        }
        yield mongoose_1.default.connect(CONNECTION_STRING);
        console.log("chat bot service connection successfull");
    }
    catch (error) {
        console.log("Error connecting database", error);
    }
});
exports.default = connectDB;
