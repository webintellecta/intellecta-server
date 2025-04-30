import express, { ErrorRequestHandler, Request, Response}  from "express";
import cors from "cors";
import dotenv from "dotenv";
import assessmentRoutes from "./routes/assessmentRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.get("/health", (req:Request, res:Response) => {
    res.status(200).send("OK");
});  

app.use(express.json());
app.use(cookieParser())

app.use("/", assessmentRoutes);

const errorHandlerMiddleware: ErrorRequestHandler = (err, req, res, next) => {
    errorHandler(err, req, res, next);
};

app.use(errorHandlerMiddleware);

export default app;