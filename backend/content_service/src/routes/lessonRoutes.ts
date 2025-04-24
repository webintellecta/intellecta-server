import express from "express";
import { addLesson, editLesson } from "../controller/lessonController";
import { upload } from "../middlewares/upload";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";

const lessonRouter = express.Router();

lessonRouter.post("/", upload.single("video"), asyncErrorHandler( addLesson ));
lessonRouter.put("/editLesson/:lessonId", upload.single("video"), asyncErrorHandler( editLesson ));

export default lessonRouter;