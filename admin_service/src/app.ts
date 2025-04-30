import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler";
import cookieParser from "cookie-parser";
import adminServiceRouter from "./router/adminRouter";


dotenv.config();

const app = express();
app.get("/health", (req:Request, res:Response) => {
    res.status(200).send("OK");
});  
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use('/',adminServiceRouter)

app.use(errorHandler as (err: any,req: Request,res: Response, next: NextFunction) => void);

export default app;