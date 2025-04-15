import { Request, Response } from "express";
import CustomError from "../utils/customError";
import { updateLessonProgressService } from "../services/progressService";

interface AuthRequest extends Request {
    user?: { _id: string };
  }

export const updateLessonProgress = async( req: AuthRequest, res: Response) => {
    if (!req.user || !req.user._id) {
        throw new CustomError("Unauthorized access. User ID not found.", 401);
    }
    const userId = req.user._id;
    const { courseId, lessonId } = req.body;
    const { progress } = await updateLessonProgressService( userId, courseId, lessonId);
    res.status(200).json({ status: "propgress updated successfully", data:progress});
};