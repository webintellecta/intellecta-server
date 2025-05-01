"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorHandler_1 = require("./middleware/errorHandler");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const gameRoute_1 = __importDefault(require("./routes/gameRoute"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.get("/health", (req, res) => {
    res.status(200).send("OK");
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use("/", gameRoute_1.default);
app.use(errorHandler_1.errorHandler);
exports.default = app;
