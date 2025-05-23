import express from "express";
import { addLesson, deleteLesson, editLesson } from "../controllers/Course/lessonController";
import { upload } from "../middleware/upload";
import { asyncHandler } from "../middleware/asyncHandler";

const lessonRouter = express.Router();

lessonRouter.post("/", upload.single("video"), asyncHandler( addLesson ));
lessonRouter.put("/editLesson/:lessonId", upload.single("video"), asyncHandler( editLesson ));
lessonRouter.delete("/:lessonId", asyncHandler(deleteLesson));


export default lessonRouter;