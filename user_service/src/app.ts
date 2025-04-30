import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import userServiceRouter from "./router/userServiceRouter";
import { errorHandler } from "./middleware/errorHandler";
import cookieParser from "cookie-parser";
import cors from 'cors'

dotenv.config();

const app = express();
app.get("/health", (req:Request, res:Response) => {
  res.status(200).send("OK");
});  
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