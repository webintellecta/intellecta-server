import { Request, Response } from "express";
import Course from "../models/coursesModel";
import { generateQuizzes } from "../utils/geminiService";
import Quiz from "../models/LessonQuiz";
import { getAllCoursesBySubjectService, getAllCoursesService, getCourseWithLessonsService, getFilteredCoursesService, getLessonByIdService, searchCoursesService } from "../services/courseServices";
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

export const searchCourses = async (req: Request, res: Response) => {
  const { subject, level } = req.query;
  const { courses } = await searchCoursesService(
    subject as string | undefined,
    level as string | undefined
  );
  res
    .status(200)
    .json({
      status: "success",
      message: "Search is successfull",
      data: courses,
    });
};


export const generateCourseQuizzesService = async (
    req: Request,
    res: Response
  ) => {
    const { courseId } = req.body;
  
    const existingQuiz = await Quiz.findOne({ courseId });
    if (existingQuiz) {
      return res.status(200).json({
        message: "Quiz already exists for this course",
        questions: existingQuiz.quizzes,
      });
    }
  
    const course = await Course.findById(courseId);
    if (!course) throw new CustomError("Course not found", 404);
  
    const { title, subject, description } = course;
  
    const prompt = `
      Generate 10 multiple choice quiz questions for kids aged 5 to 18.
      Use the following course information:
      Title: "${title}"
      Subject: "${subject}"
      Description: "${description}"
  
      Output format (JSON only):
      {
        "quizzes": [
          {
            "question": "Question text?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": "Option A",
            "explanation": "Simple explanation why this is the correct answer",
            "subject": "${subject}",
            "difficulty": "easy"
          }
        ]
      }
  
      Keep the language simple and fun for kids.
    `;
  
    const aiResponse = await generateQuizzes(prompt);
  
    let parsedQuizResponse;
    try {
      const cleanedResponse = aiResponse
        .replace(/```json?/g, "")
        .replace(/```/g, "")
        .trim();
  
      parsedQuizResponse = JSON.parse(cleanedResponse);
      if (
        !Array.isArray(parsedQuizResponse.quizzes) ||
        parsedQuizResponse.quizzes.length === 0
      ) {
        throw new Error("No quizzes found");
      }
    } catch (error) {
      console.error("Failed to parse AI response:", error);
      throw new CustomError("Invalid AI response format", 500);
    }
  
    const formattedQuestions = parsedQuizResponse.quizzes.map((q: any) => ({
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      subject: q.subject,
      difficulty: q.difficulty,
    }));
  
    const newQuiz = await Quiz.create({
      courseId,
      quizzes: formattedQuestions,
    });
  
    return res.status(201).json({
      message: "Quizzes generated and saved",
      questions: newQuiz.quizzes,
    });
  };
  

export const fetchLessonQuiz = async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const quiz = await Quiz.findOne({ courseId });
  if (!quiz) {
    throw new CustomError("NO quiz found for this lesson", 400);
  }
   function shuffleArray<T>(array: T[]): T[] {
    return array.sort(() => Math.random() - 0.5);
  }

  const formatQuizQuestion = quiz.quizzes.map((q: any) => ({
    question: q.question,
    options: shuffleArray(q.options),
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    subject: q.subject,
    difficulty: q.difficulty,
  }));

  return res.status(200).json({ message: "quiz fetched successfully", quiz : formatQuizQuestion });
};
export const getFilteredCourses = async(req: Request, res: Response) => {
    const { subject } = req.params;
    const { gradeLevel, difficultyLevel } = req.query;
  
    console.log("Received query:", { subject, gradeLevel, difficultyLevel }); 

      const { courses } = await getFilteredCoursesService(subject, gradeLevel as string | undefined, difficultyLevel as string | undefined);
      res.status(200).json({status: "success", message: "Filtration is successful", data: courses});
    }

