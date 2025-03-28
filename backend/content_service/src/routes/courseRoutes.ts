import express from "express";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { getAllCourses, getAllCoursesBySubject, getCourseWithLessons, getLessonById } from "../controller/courseController";

const courseRouter = express.Router();

courseRouter.get("/", asyncErrorHandler( getAllCourses));
courseRouter.get("/:courseId", asyncErrorHandler( getCourseWithLessons));
courseRouter.get("/lessons/:lessonId", asyncErrorHandler( getLessonById));
courseRouter.get("/subject/:subject", asyncErrorHandler( getAllCoursesBySubject));

export default courseRouter;
