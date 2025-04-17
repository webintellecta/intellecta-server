import express from "express";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { authMiddleware } from "../middlewares/auth"
import { getUserCourseProgress, updateLessonProgress } from "../controller/progressController";

const progressRouter = express.Router();

progressRouter.post("/update",authMiddleware, asyncErrorHandler( updateLessonProgress ));
progressRouter.get("/:courseId",authMiddleware, asyncErrorHandler( getUserCourseProgress ));


export default progressRouter;
