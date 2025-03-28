import { Request, Response } from "express";
import { getAllCoursesBySubjectService, getAllCoursesService, getCourseWithLessonsService, getLessonByIdService, searchCoursesService } from "../services/courseServices";

export const getAllCourses = async( req: Request, res: Response) => {
    const { courses } = await getAllCoursesService();
    res.status(200).json({status:"success", message:'All Courses fetched successfully', data:courses});
};

export const getAllCoursesBySubject = async(req:Request, res:Response) => {
    const { subject } = req.params;
    const { courses } = await getAllCoursesBySubjectService(subject);
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

export const searchCourses = async (req:Request, res:Response) => {
    const { subject, level } = req.query;
    const { courses } = await searchCoursesService(subject as string | undefined,level as string | undefined);
    res.status(200).json({ status:'success', message:"Search is successfull", data:courses});
};

