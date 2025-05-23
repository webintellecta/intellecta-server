import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import userServiceRouter from "./router/userServiceRouter";
import { errorHandler } from "./middleware/errorHandler";
import cookieParser from "cookie-parser";
import cors from 'cors'
import notificationServiceRouter from "./router/notificationrouter";
import gameRouter from "./router/gameRoute";
import courseRoutes from "./router/courseRoutes";
import lessonRoutes from "./router/lessonRoutes";
import progressRoutes from "./router/progressRoutes";
import assessmentRoutes from "./router/assessmentRoutes";
import adminServiceRouter from "./router/adminRouter";

dotenv.config();

const app = express();

app.use(cors({
  origin: ["https://intellecta-web.vercel.app/","http://localhost:5173"],
  credentials: true
}))

app.get("/health", (req:Request, res:Response) => {
  res.status(200).send("OK");
});  
app.use(express.json());
app.use(cookieParser())

app.use('/api/user',userServiceRouter)
app.use('/api/notification',notificationServiceRouter)
app.use("/api/games", gameRouter)

app.use("/api/courses", courseRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/ai-tutor", assessmentRoutes)
app.use('/api/admin',adminServiceRouter)

app.use(
    errorHandler as (
        err: any,
        req: Request,
        res: Response,
        next: NextFunction
      ) => void
    );

export default app;