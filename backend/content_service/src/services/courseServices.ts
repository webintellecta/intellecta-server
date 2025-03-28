import Course from "../models/coursesModel"
import Lesson from "../models/lessonsModel";
import CustomError from "../utils/customError";

export const getAllCoursesService = async () => {
    const courses = await Course.find();
    return { courses };
};

export const getCourseWithLessonsService = async( courseId:string) => {
    if(!courseId){
        throw new CustomError("Please provide the course id", 404);
    }
    const course = await Course.findById(courseId);
    if(!course){
        throw new CustomError("Course not found", 404);
    }
    const lessons = await Lesson.find({course: courseId});
    if(!lessons){
        throw new CustomError("No lessons for the provided course", 404);
    }
    return { course, lessons };
};

export const getLessonByIdService = async( lessonId:string ) => {
    if(!lessonId){
        throw new CustomError("Please provide the lesson id", 404);
    }
    const lesson = await Lesson.findById(lessonId);
    if(!lesson){
        throw new CustomError("Lesson not found", 404);
    }
    return { lesson };
}