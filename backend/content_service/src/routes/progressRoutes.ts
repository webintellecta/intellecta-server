import express from "express";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { authMiddleware } from "../middlewares/auth"
<<<<<<< HEAD
import { getAllUserCourseProgress, getUserCourseProgress, updateLessonProgress } from "../controller/progressController";
=======
import { getUserCourseProgress, markLessonAsComplete, quizScoreUpdate } from "../controller/progressController";
>>>>>>> c463f20b4a508d34e8feddd4496c86729391b011

const progressRouter = express.Router();

progressRouter.post("/update",authMiddleware, asyncErrorHandler( markLessonAsComplete ));
progressRouter.get("/:courseId",authMiddleware, asyncErrorHandler( getUserCourseProgress ));
progressRouter.post("/update/quiz-score",authMiddleware, asyncErrorHandler( quizScoreUpdate ));

progressRouter.get("/allusercourse/aa",authMiddleware,asyncErrorHandler(getAllUserCourseProgress))


export default progressRouter;
