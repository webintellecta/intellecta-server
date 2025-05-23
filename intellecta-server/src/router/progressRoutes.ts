import express from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { isAuthenticate } from "../middleware/isAuth"
import { getAllUserCourseProgress, getTopCourses, getUserCourseProgress, markLessonAsComplete, quizScoreUpdate } from "../controllers/Course/progressController";

const progressRouter = express.Router();

progressRouter.post("/update",isAuthenticate, asyncHandler( markLessonAsComplete ));
progressRouter.get("/top", asyncHandler( getTopCourses ));
progressRouter.get("/:courseId",isAuthenticate, asyncHandler( getUserCourseProgress ));

progressRouter.post("/update/quiz-score",isAuthenticate, asyncHandler( quizScoreUpdate ));
progressRouter.get("/allusercourse/aa",isAuthenticate,asyncHandler(getAllUserCourseProgress));

export default progressRouter;
