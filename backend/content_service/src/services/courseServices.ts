import Course from "../models/coursesModel";
import Lesson from "../models/lessonsModel";
// import LessonProgress from "../models/lessonProgressModel";
import CustomError from "../utils/customError";
import { generatePresignedUrl } from "../middlewares/upload";

interface PaginationParams {
  skip: number;
  limit: number;
}

const isS3ObjectKey = (thumbnail: string): boolean => {
  return !/^https?:\/\//i.test(thumbnail);
};

export const getAllCoursesService = async ({
  skip,
  limit,
}: PaginationParams) => {
  const courses = await Course.find().skip(skip).limit(limit);
  const totalCourses = await Course.countDocuments();

  const coursesWithPresignedUrls = await Promise.all(
    courses.map(async (course) => {
      const courseData = course.toObject();

      if (course.thumbnail) {
        if (isS3ObjectKey(course.thumbnail)) {
          const presignedUrl = await generatePresignedUrl(course.thumbnail);
          courseData.thumbnail = presignedUrl ?? undefined;
        } else {
          courseData.thumbnail = course.thumbnail ?? undefined;
        }
      } else {
        courseData.thumbnail = undefined;
      }
     return courseData;
    })
  );
    return { courses: coursesWithPresignedUrls, totalCourses };
};

export const getAllCoursesBySubjectService = async (
  subject: string,
  gradeLevel: number
) => {
  if (!subject || !gradeLevel) {
    throw new CustomError("Please provide the subject", 404);
  }

  const courses = await Course.find({ subject, gradeLevel });
  if (!courses || courses.length === 0) {
    throw new CustomError("There are no course for this subject", 404);
  }

  const coursesWithPresignedUrls = await Promise.all(
    courses.map(async (course) => {
      const courseData = course.toObject();

      if (course.thumbnail) {
        if (isS3ObjectKey(course.thumbnail)) {
          const presignedUrl = await generatePresignedUrl(course.thumbnail);
          courseData.thumbnail = presignedUrl ?? undefined;
        } else {
          courseData.thumbnail = course.thumbnail ?? undefined;
        }
      } else {
        courseData.thumbnail = undefined;
      }
    return courseData;
    })
  );
    return { courses: coursesWithPresignedUrls };
};

export const getCourseWithLessonsService = async (courseId: string) => {
  if (!courseId) {
    throw new CustomError("Please provide the course id", 404);
  }
  const course = await Course.findById(courseId);
  if (!course) {
    throw new CustomError("Course not found", 404);
  }
  const lessons = await Lesson.find({ course: courseId }).sort({ order: 1 });
  if (!lessons) {
    throw new CustomError("No lessons for the provided course", 404);
  }
  return { course, lessons };
};

export const getLessonByIdService = async (lessonId: string) => {
  if (!lessonId) {
    throw new CustomError("Please provide the lesson id", 404);
  }
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    throw new CustomError("Lesson not found", 404);
  }
  return { lesson };
};

export const searchCoursesService = async (
  subject?: string,
  level?: string
) => {
  const query: any = {};
  if (subject) query.subject = subject;
  if (level) query.difficultyLevel = level;

  const courses = await Course.find(query);
  if (!courses || courses.length === 0) {
    throw new CustomError("No courses found for the given filters", 404);
  }
  return { courses };
};

export const getFilteredCoursesService = async (
  subject: string,
  gradeLevel?: string,
  difficultyLevel?: string
) => {
  const filter: any = {};
  if (subject) {
    filter.subject = subject.toLowerCase();
  }

  if (gradeLevel) {
    const grades = gradeLevel.split(",").map((g) => {
      const gradeNum = Number(g.replace("Grade ", ""));
      if (isNaN(gradeNum)) throw new CustomError("Invalid grade level", 400);
      return gradeNum;
    });
    filter.gradeLevel = { $in: grades };
  }

  if (difficultyLevel) {
    const levels = difficultyLevel.split(",").map((l) => l.toLowerCase());
    filter.difficultyLevel = { $in: levels };
  }
  const courses = await Course.find(filter);
  if (!courses || courses.length === 0) {
    console.log("No courses found for filter:", filter);
    throw new CustomError("No courses found for the given filters", 404);
  }

  console.log("Courses found:", courses.length);
  return { courses };
};
