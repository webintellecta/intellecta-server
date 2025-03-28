import express from "express";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { getAllCourses, getCourseWithLessons } from "../controller/courseController";

const courseRouter = express.Router();

courseRouter.get("/", asyncErrorHandler( getAllCourses));
courseRouter.get("/:courseId", asyncErrorHandler( getCourseWithLessons));

export default courseRouter;
