import express, { ErrorRequestHandler}  from "express";
import cors from "cors";
import dotenv from "dotenv";
import assessmentRoutes from "./routes/assessmentRoutes";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/assessment", assessmentRoutes);

const errorHandlerMiddleware: ErrorRequestHandler = (err, req, res, next) => {
    errorHandler(err, req, res, next);
};

app.use(errorHandlerMiddleware);

export default app;