import express from "express";
import { addLesson } from "../controller/lessonController";
import { upload } from "../middlewares/upload";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";

const lessonRouter = express.Router();

lessonRouter.post("/", upload.single("video"), asyncErrorHandler( addLesson ));

export default lessonRouter;