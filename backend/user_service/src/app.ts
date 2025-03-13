import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import userServiceRouter from "./router/userServiceRouter";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();





const app = express();
app.use(express.json());

app.use('/api/user',userServiceRouter)












app.use(
    errorHandler as (
        err: any,
        req: Request,
        res: Response,
        next: NextFunction
      ) => void
    );

export default app;
