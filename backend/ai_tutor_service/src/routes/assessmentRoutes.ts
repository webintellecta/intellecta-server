import express from "express";
import { getAssessmentQuestions } from "../controllers/assessmentController";
import { authMiddleware } from "../middlewares/auth";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";

const assessmentRouter = express.Router();

assessmentRouter.get("/questions", authMiddleware, asyncErrorHandler( getAssessmentQuestions ));

export default assessmentRouter;