import axios from "axios";
import AssessmentQuestion from "../models/questionModel";
import { determineUserLevel } from "../utils/userLevel";
import CustomError from "../utils/customError";
import { getAiTutorResponse } from "../utils/huggingFaceService";
import { Document } from "mongoose";
import Assessment from "../models/assessmentModel";
import { userCache } from "../consumers/userConsumer";
console.log("userData-outSide",userCache)
interface QuestionDocument extends Document {
    _id: string;
    subject: string;
    correctAnswer: string;
}
    
export const getAssessmentQuesService = async (userId?: string) => {
    if (!userId) {
        throw new CustomError("Unauthorized: No user ID found", 401);
    }

    const userData = userCache.get(userId);
    if (!userData) {
        throw new CustomError("User data not found. Try again later.", 400);
    }

    console.log("userData",userData)
    const { age } = userData;
    const level = determineUserLevel(age);

    const questions = await AssessmentQuestion.find({ difficulty: level }).limit(10).lean();

    return { userId, age, level, questions };
};

export const evaluateAssessmentService = async( data: any) => {
    const { userId, answers } = data;
    if (!userId || !answers || !Array.isArray(answers)) {
        throw new CustomError("Invalid input data" , 400);
    }
    const questionIds = answers.map(a => a._id);
    const questions: QuestionDocument[] = await AssessmentQuestion.find({ _id: { $in: questionIds } });

    let correctCount = 0;
    let totalQuestions = questions.length;
    let subjectScores: Record<string, number> = {};

    answers.forEach(userAnswer => {
        const question = questions.find(q => q._id.toString() === userAnswer._id);
        if (question) {
            const isCorrect = question.correctAnswer === userAnswer.selectedOption;
            if (isCorrect) correctCount++;
            subjectScores[question.subject] = (subjectScores[question.subject] || 0) + (isCorrect ? 1 : 0);
        }
    });
    const scorePercentage = (correctCount / totalQuestions) * 100;
    let strengths = Object.keys(subjectScores).filter(subj => subjectScores[subj] >= 2);
    let weaknesses = Object.keys(subjectScores).filter(subj => subjectScores[subj] < 2);
    const assessmentResult = {
        userId,
        totalQuestions,
        correctCount,
        scorePercentage,
        strengths,
        weaknesses
    };
    const aiFeedback = await getAiTutorResponse(assessmentResult);
    let cleanedFeedback = aiFeedback[0]?.generated_text || "No feedback available";
    if (cleanedFeedback.includes("Strengths")) {
        cleanedFeedback = cleanedFeedback.substring(cleanedFeedback.indexOf("Strengths"));
    }

    
    const savedAssessment = await Assessment.create({
        ...assessmentResult,
        aiFeedback: cleanedFeedback
    });

    return { assessmentResult: savedAssessment };

}