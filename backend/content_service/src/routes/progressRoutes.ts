import express from "express";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { authMiddleware } from "../middlewares/auth"
import { updateLessonProgress } from "../controller/progressController";

const progressRouter = express.Router();

progressRouter.post("/update",authMiddleware, asyncErrorHandler( updateLessonProgress ));



export default progressRouter;
