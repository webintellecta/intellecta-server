import express from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { isAuthenticate } from "../middleware/isAuth"
import { addCourse, deleteCourse, editCourse, fetchLessonQuiz, generateCourseQuizzesService, getAllCourses, getAllCoursesBySubject, getCourseWithLessons, getFilteredCourses, getLessonById, searchCourses } from "../controllers/Course/courseController";
import { upload } from "../middleware/upload";

const courseRouter = express.Router();

courseRouter.get("/search", asyncHandler( searchCourses ));

courseRouter.get("/", asyncHandler( getAllCourses));
courseRouter.post("/", upload.single('image'), asyncHandler( addCourse ));
courseRouter.put("/editCourse/:courseId", upload.single('image'), asyncHandler( editCourse ));
courseRouter.patch("/deleteCourse/:courseId", asyncHandler( deleteCourse ));
courseRouter.get("/:subject/filter", asyncHandler( getFilteredCourses ));
courseRouter.get("/:courseId", asyncHandler( getCourseWithLessons));
courseRouter.get("/lessons/:lessonId", asyncHandler( getLessonById));
// courseRouter.post("/lessons/:lessonId/complete", authMiddleware, asyncHandler(markLessonAsComplete));
courseRouter.get("/subject/:subject",isAuthenticate ,asyncHandler( getAllCoursesBySubject));
courseRouter.post("/generate-quiz", asyncHandler(generateCourseQuizzesService));
courseRouter.get("/fetch-quiz/:courseId", asyncHandler(fetchLessonQuiz));


export default courseRouter;
