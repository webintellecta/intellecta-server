import { Request, Response } from "express";
import { getAllCoursesBySubjectService, getAllCoursesService, getCourseWithLessonsService, getFilteredCoursesService, getLessonByIdService, markLessonAsCompleteService, searchCoursesService } from "../services/courseServices";
import CustomError from "../utils/customError";
import { mapAgeToGradeAndDifficulty } from "../utils/gradeMapping";
import { publishToQueue } from "../utils/rabbitmq/rabbitmqPublish";
import { getUserData } from "../consumers/userConsumers";

interface UserData {
    _id: string;
    name: string;
    email: string;
    age: number;
    phone: string;
    role: string;
    profilePic: string;
    createdAt: Date;
    updatedAt: Date;
}

interface AuthRequest extends Request {
    user?: { _id: string };
  }

export const getAllCourses = async( req: Request, res: Response) => {
    const { courses } = await getAllCoursesService();
    res.status(200).json({status:"success", message:'All Courses fetched successfully', data:courses});
};

export const getAllCoursesBySubject = async(req:AuthRequest, res:Response) => {
    const { subject } = req.params;
    if (!req.user || !req.user._id) {
        throw new CustomError("Unauthorized access. User ID not found.", 401);
      }
    const userId = req.user._id;
      
    await publishToQueue("user_id", userId);

    let userData = (await getUserData(userId)) as UserData | undefined;

    if (!userData) {
        throw new CustomError("User data not found. Try again later.", 400);
    }

    if (userData instanceof Map) {
        userData = Object.fromEntries(userData) as UserData;
    }
    const  age  = userData.age;
    if (!age) {     
        throw new CustomError("User age not found in token", 400);
      }
    const { gradeLevel, difficultyLevel } = mapAgeToGradeAndDifficulty(age);
    const { courses } = await getAllCoursesBySubjectService(subject, gradeLevel);
    res.status(200).json({ status:"success", message: "Courses By Subject fetched succcessfully", data: courses});
};

export const getCourseWithLessons = async(req:Request, res:Response) => {
    const { courseId } = req.params;
    const { course, lessons } = await getCourseWithLessonsService(courseId);
    res.status(200).json({status: "success", message:'Lessons fetched successfully', data: {course, lessons}});
};

export const getLessonById = async(req:Request, res:Response) => {
    const { lessonId } = req.params;
    const { lesson } = await getLessonByIdService(lessonId);
    res.status(200).json({status: "success", message:'Lesson fetched successfully', data:lesson});
};

export const markLessonAsComplete = async (req: AuthRequest, res: Response) => {
    const { lessonId } = req.params;
    const userId = req.user?._id;
    console.log("lesson progress", userId);

    if (!userId) {
        return res.status(401).json({
          status: "error",
          message: "User not authenticated",
        });
      }

    const { progress } = await markLessonAsCompleteService(lessonId, userId);

    res.status(200).json({
        status: "success",
        message: "Lesson marked as complete",
        data: progress,
    });
};

export const searchCourses = async (req:Request, res:Response) => {
    const { subject, level } = req.query;
    const { courses } = await searchCoursesService(subject as string | undefined,level as string | undefined);
    res.status(200).json({ status:'success', message:"Search is successfull", data:courses});
};

export const getFilteredCourses = async (req: Request, res: Response) => {
    const { subject } = req.params;
    const { gradeLevel, difficultyLevel } = req.query;
  
    console.log("Received query:", { subject, gradeLevel, difficultyLevel }); 

      const { courses } = await getFilteredCoursesService(subject, gradeLevel as string | undefined, difficultyLevel as string | undefined);
      res.status(200).json({status: "success", message: "Filtration is successful", data: courses});
    }

