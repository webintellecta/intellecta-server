import express from "express";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { authMiddleware } from "../middlewares/auth"
import { getAllUserCourseProgress, getUserCourseProgress, updateLessonProgress } from "../controller/progressController";

const progressRouter = express.Router();

progressRouter.post("/update",authMiddleware, asyncErrorHandler( updateLessonProgress ));
progressRouter.get("/:courseId",authMiddleware, asyncErrorHandler( getUserCourseProgress ));

progressRouter.get("/allusercourse/aa",authMiddleware,asyncErrorHandler(getAllUserCourseProgress))


export default progressRouter;
