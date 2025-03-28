import Course from "../models/coursesModel"
import Lesson from "../models/lessonsModel";
import CustomError from "../utils/customError";

export const getAllCoursesService = async () => {
    const courses = await Course.find();
    return { courses };
};

export const getAllCoursesBySubjectService = async (subject:string) => {
    if(!subject){
        throw new CustomError("Please provide the subject", 404);
    }
    const courses = await Course.find({ subject });
    if (!courses || courses.length === 0){
        throw new CustomError("There are no course for this subject", 404);
    }
    return { courses };
}

export const getCourseWithLessonsService = async (courseId:string) => {
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

export const searchCoursesService = async (subject?:string, level?:string) => {
    const query: any = {};
    if (subject) query.subject = subject;
    if (level) query.difficultyLevel = level;

    const courses = await Course.find(query);
    if (!courses || courses.length === 0) {
        throw new CustomError("No courses found for the given filters", 404);
    }
    return { courses };
}