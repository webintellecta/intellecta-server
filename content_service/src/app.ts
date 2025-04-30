import express, { ErrorRequestHandler, Request, Response}  from "express";
import cors from "cors";
import dotenv from "dotenv";
import courseRoutes from "./routes/courseRoutes";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";
import progressRoutes from "./routes/progressRoutes";
import lessonRoutes from "./routes/lessonRoutes";

dotenv.config();

const app = express();
app.get("/health", (req:Request, res:Response) => {
    res.status(200).send("OK");
});  
app.use(express.json());
app.use(cookieParser());

app.use("/", courseRoutes);
app.use("/", progressRoutes);
app.use("/", lessonRoutes);

const errorHandlerMiddleware: ErrorRequestHandler = (err, req, res, next) => {
    globalErrorHandler(err, req, res, next);
};

app.use(errorHandlerMiddleware);

export default app;