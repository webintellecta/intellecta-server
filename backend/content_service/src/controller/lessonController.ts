import { Request, Response } from "express";
import Lesson from "../models/lessonsModel";
import Course from "../models/coursesModel";
import { uploadToS3, generatePresignedUrl } from "../middlewares/upload";
import CustomError from "../utils/customError";

// Controller to add a lesson
export const addLesson = async (req: Request, res: Response) => {
  const { courseId, title, type, content, resources, notes, order } = req.body;
  if (!courseId) {
    throw new CustomError("Course ID is required.", 400);
  }
  const course = await Course.findById(courseId);
  if (!course) {
    throw new CustomError("Course not found.", 404);
  }

  let videoUrl: string | null = null;
  if (req.file) {
    try {
      const s3Key = await uploadToS3(req.file);
      videoUrl = await generatePresignedUrl(s3Key);
      if (!videoUrl) {
        throw new CustomError("Failed to generate video URL.", 500);
      }
    } catch (error) {
      console.error("Error uploading video to S3:", error);
      throw new CustomError("Failed to upload video.", 500);
    }
  }

  // Create a new lesson document
  const newLesson = new Lesson({
    course: courseId,
    title,
    type,
    url: videoUrl,
    content,
    resources,
    notes,
    order,
  });
  const savedLesson = await newLesson.save();
  res.status(201).json({
    message: "Lesson added successfully.",
    lesson: savedLesson,
  });
};
