import express from "express";
import { evaluateAssessment, getAssessmentQuestions } from "../controllers/Assessment/assessmentController";
import { isAuthenticate } from "../middleware/isAuth";
import { asyncHandler } from "../middleware/asyncHandler";
import { generateSyllabus } from "../controllers/Assessment/aiTutorController";

const assessmentRouter = express.Router();

assessmentRouter.get("/questions", isAuthenticate, asyncHandler ( getAssessmentQuestions ));
assessmentRouter.post("/evaluate", isAuthenticate, asyncHandler ( evaluateAssessment ));
assessmentRouter.get("/syllabus", isAuthenticate, asyncHandler ( generateSyllabus ));



export default assessmentRouter;