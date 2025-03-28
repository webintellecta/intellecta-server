import express, { ErrorRequestHandler}  from "express";
import cors from "cors";
import dotenv from "dotenv";
import courseRoutes from "./routes/courseRoutes";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";

dotenv.config();

const app = express();
app.use(
    cors({
      origin: "http://localhost:5173", 
      credentials: true,
    })
  );

app.use(express.json());

app.use("/api/courses", courseRoutes);

const errorHandlerMiddleware: ErrorRequestHandler = (err, req, res, next) => {
    globalErrorHandler(err, req, res, next);
};

app.use(errorHandlerMiddleware);

export default app;