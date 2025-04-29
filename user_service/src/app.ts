import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import userServiceRouter from "./router/userServiceRouter";
import { errorHandler } from "./middleware/errorHandler";
import cookieParser from "cookie-parser";
import cors from 'cors'

dotenv.config();

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "https://intellecta-web.vercel.app"], 
    credentials: true, // Allow cookies/auth headers
  })
);
app.use(express.json());
app.use(cookieParser())

app.use('/',userServiceRouter)




app.use(
    errorHandler as (
        err: any,
        req: Request,
        res: Response,
        next: NextFunction
      ) => void
    );

export default app;