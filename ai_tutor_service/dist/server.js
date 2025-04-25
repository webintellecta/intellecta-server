"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const app_1 = __importDefault(require("./app"));
require("./consumers/userConsumer");
dotenv_1.default.config();
(0, db_1.default)();
const PORT = process.env.PORT;
app_1.default.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
