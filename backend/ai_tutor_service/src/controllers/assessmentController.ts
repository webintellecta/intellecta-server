import { Request, Response } from "express";
import { getAssessmentQuesService } from "../services/assessmentQuesService";

interface AuthRequest extends Request {
    user?: { _id: string };
}
  
export const getAssessmentQuestions = async (req: AuthRequest, res: Response ): Promise<void>  => {
  const { userId, age, level, questions } = await getAssessmentQuesService(req.user?._id);
  res.status(200).json({
    status: "success",
    message: "Assessment Questions",
    userId,
    age,
    level,
    questions,
  });
};

