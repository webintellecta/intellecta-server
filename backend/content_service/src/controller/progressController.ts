import { Request, Response } from "express";
import CustomError from "../utils/customError";
import {
  getUserCourseProgressService,
  markLessonAsCompleteService, 
  updateCourseQuizScoreService
} from "../services/progressService";
import Lesson from "../models/lessonsModel";
import LessonProgress from "../models/lessonProgressModel";
import UserProgress from "../models/userProgressModel";

interface AuthRequest extends Request {
  user?: { _id: string };
}

export const markLessonAsComplete = async (req: AuthRequest, res: Response) => {
  const { courseId, lessonId } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    throw new CustomError("User not authenticated", 401);
  }

  const { progress } = await markLessonAsCompleteService(userId, courseId, lessonId);

  res.status(200).json({
    status: "success",
    message: "Lesson marked as complete",
    data: progress,
  });
};



// export const updateLessonProgress = async (req: AuthRequest, res: Response) => {
//   if (!req.user || !req.user._id) {
//     throw new CustomError("Unauthorized access. User ID not found.", 401);
//   }
//   const userId = req.user._id;
//   const { courseId, lessonId } = req.body;

//   const { progress } = await updateLessonProgressService(
//     userId,
//     courseId,
//     lessonId
//   );

//   res
//     .status(200)
//     .json({
//       status: "success",
//       message: "propgress updated successfully",
//       data: progress,
//     });
// };

export const getUserCourseProgress = async (
  req: AuthRequest,
  res: Response
) => {
  if (!req.user || !req.user._id) {
    throw new CustomError("Unauthorized access. User ID not found.", 401);
  }
  const userId = req.user._id;
  const { courseId } = req.params;

  const { progress } = await getUserCourseProgressService(userId, courseId);

  res
    .status(200)
    .json({
      status: "success",
      message: "propgress fetched successfully",
      data: progress,
    });
};




export const quizScoreUpdate = async (req: AuthRequest, res: Response) => {
  const { courseId, score, totalQuestions = 10 } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    throw new CustomError("User not authenticated", 401);
  }
  const existingProgress = await UserProgress.findOne({ userId, courseId });
  if (existingProgress?.quiz?.attempted && existingProgress.quiz.score >= score) {
    return res.status(400).json({
      status: "fail",
      message: "Your previous score is higher or equal. Resubmission not allowed.",
    });
  }
  
  const { progress } = await updateCourseQuizScoreService(userId, courseId, score, totalQuestions);

  res.status(200).json({
    status: "success",
    message:"Quiz score updated successfully",
    data: progress,
  });
};

