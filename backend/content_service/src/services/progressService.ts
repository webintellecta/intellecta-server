import mongoose from "mongoose";
import Lesson from "../models/lessonsModel";
import UserProgress from "../models/userProgressModel";
import CustomError from "../utils/customError"

export const updateLessonProgressService = async( userId: string, courseId: string, lessonId: string) => {
    if(!userId || !courseId || !lessonId){
        throw new CustomError("Please provide the userId, courseId and lessonId",404);
    }
    const totalLessons = await Lesson.countDocuments({ course : courseId});
    let progress = await UserProgress.findOne({ userId, courseId});

    const lessonObjectId = new mongoose.Types.ObjectId(lessonId);

    if (progress) {
        const alreadyCompleted = progress.completedLessons.some(id =>
            id.equals(lessonObjectId)
        );

        if (!alreadyCompleted) {
            progress.completedLessons.push(lessonObjectId);
        }
      
        progress.progressPercent = (progress.completedLessons.length / totalLessons) * 100;
        progress.currentLesson = lessonObjectId;
        progress.lastUpdated = new Date();
        await progress.save();
    } else {
        progress = await UserProgress.create({
          userId,
          courseId,
          completedLessons: [lessonObjectId],
          currentLesson: lessonObjectId,
          progressPercent: (1 / totalLessons) * 100,
        });
    }
    return { progress }; 

}

export const getUserCourseProgressService = async (userId: string, courseId: string) => {
    if(!userId || !courseId){
        throw new CustomError("Please provide the userId, courseId and lessonId",404);
    }
    const progress = await UserProgress.findOne({ userId, courseId });
    if (!progress) {
        throw new CustomError('No progress found', 404);
    }
    return { progress };
};   