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
    const age  = userData.age;
    const level = determineUserLevel(age);
    const questions = await AssessmentQuestion.find({ difficulty: level }).limit(15).lean();
    return { userId, age, level, questions };
};

// First, define the type for AITutorResponse if not already defined
interface AITutorResponse {
    generated_text?: string;
    [key: string]: any;
}

export const evaluateAssessmentService = async(data: any) => {
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
    
    const aiPrompt = `Assess this user's learning level and suggest a personalized learning path: ${JSON.stringify(assessmentResult)}`;
    const rawAiResponse: AITutorResponse[] = await getAiTutorResponse(aiPrompt);

    // Parse the AI response dynamically
    let parsedAiResponse: any;
    try {
        // Extract the first generated_text if it's an array
        const responseText = Array.isArray(rawAiResponse) 
            ? rawAiResponse[0]?.generated_text || JSON.stringify(rawAiResponse)
            : rawAiResponse as string;

        // Use a more flexible regex that works with es2015+
        const jsonMatch = responseText.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/);
        
        if (jsonMatch) {
            parsedAiResponse = JSON.parse(jsonMatch[0]);
        } else {
            // Fallback parsing if direct JSON extraction fails
            parsedAiResponse = {
                originalResponse: responseText,
                learningPath: extractLearningPath(responseText)
            };
        }
    } catch (error) {
        parsedAiResponse = {
            originalResponse: JSON.stringify(rawAiResponse),
            error: 'Failed to parse AI response'
        };
    }

    const savedAssessment = await Assessment.create({
        ...assessmentResult,
        rawAiResponse: JSON.stringify(parsedAiResponse)
    });

    return { 
        assessmentResult: savedAssessment, 
        rawAiResponse: parsedAiResponse 
    };
};

// Helper function to extract learning path if full JSON parsing fails
function extractLearningPath(response: string): string {
    // Regex without 's' and 'i' flags
    const learningPathRegex = /learning\s*path\s*:?\s*([\s\S]*?)(?=\n\n|\n|$)/;
    
    const match = response.match(learningPathRegex);
    
    // Case-insensitive manual matching
    if (!match) {
        const lowerResponse = response.toLowerCase();
        const learningPathIndex = lowerResponse.indexOf('learning path');
        
        if (learningPathIndex !== -1) {
            const extractedPath = response.substring(learningPathIndex + 'learning path'.length)
                .replace(/^:\s*/, '')  // Remove colon and leading spaces
                .split(/\n\n/)[0]  // Take first paragraph
                .trim();
            
            return extractedPath || 'No specific learning path found';
        }
    }
    
    return match ? match[1].trim() : 'No specific learning path found';
}