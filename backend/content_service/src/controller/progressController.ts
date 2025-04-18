import { Request, Response } from "express";
import CustomError from "../utils/customError";
import { getAllUserProgressService, getUserCourseProgressService, updateLessonProgressService } from "../services/progressService";
import mongoose from "mongoose";

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

    res.status(200).json({ status:"success", message: "propgress updated successfully", data:progress});
};

export const getUserCourseProgress = async (req: AuthRequest, res: Response) => {
    if (!req.user || !req.user._id) {
        throw new CustomError("Unauthorized access. User ID not found.", 401);
    }
    const userId = req.user._id;
    const { courseId } = req.params;
  
    const { progress } = await getUserCourseProgressService( userId, courseId);
  
    res.status(200).json({ status:"success", message: "propgress fetched successfully", data:progress});
};



//all attempted course of a particular user
export const getAllUserCourseProgress = async(req:AuthRequest, res:Response)=>{
    console.log("hello")
    if (!req.user || !req.user._id) {
        throw new CustomError("Unauthorized access. User ID not found.", 401);
    }
    const userId = req.user._id;
    if(!mongoose.Types.ObjectId.isValid(userId)){
        throw new CustomError("user id format Invalid",401)
    }
    const progressData = await getAllUserProgressService(userId)

    res.status(200).json({status:"success", message:"progress data fetched", data:progressData})
}

  