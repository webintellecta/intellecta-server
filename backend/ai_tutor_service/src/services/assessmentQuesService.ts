import axios from "axios";
import AssessmentQuestion from "../models/questionModel";
import { determineUserLevel } from "../utils/userLevel";
import CustomError from "../utils/customError";
import { getAiTutorResponse } from "../utils/huggingFaceService";
import { Document } from "mongoose";
import Assessment from "../models/assessmentModel";
import { userCache } from "../consumers/userConsumer";
import { parse } from 'json5';
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

export const evaluateAssessmentService = async(data: any) => {
    const { userId, answers } = data;
    if (!userId || !answers || !Array.isArray(answers)) {
        throw new CustomError("Invalid input data", 400);
    }
    
    // Get all the questions that were answered
    const questionIds = answers.map(a => a._id);
    const questions: QuestionDocument[] = await AssessmentQuestion.find({ _id: { $in: questionIds } });
    
    // Calculate basic scores
    let correctCount = 0;
    let subjectScores: Record<string, number> = {};
    
    // Initialize all subjects with 0 score
    questions.forEach(question => {
        if (!subjectScores[question.subject]) {
            subjectScores[question.subject] = 0;
        }
    });
    
    // Count correct answers
    answers.forEach(userAnswer => {
        const question = questions.find(q => q._id.toString() === userAnswer._id);
        if (question && question.correctAnswer === userAnswer.selectedOption) {
            correctCount++;
            subjectScores[question.subject] += 1;
        }
    });
    
    const totalQuestions = questions.length;
    const scorePercentage = (correctCount / totalQuestions) * 100;
    
    // Determine strengths and weaknesses
    const allSubjects = Object.keys(subjectScores);
    const strengthThreshold = 2;
    
    let strengths = allSubjects.filter(subj => subjectScores[subj] >= strengthThreshold);
    let weaknesses = allSubjects.filter(subj => subjectScores[subj] < strengthThreshold);
    
    // Create the basic assessment result
    const assessmentResult = {
        userId,
        totalQuestions,
        correctCount,
        scorePercentage,
        strengths,
        weaknesses,
        subjectScores
    };
    
    // Create a simple, structured prompt for the AI
    const aiPrompt = `Based on the user's assessment results ${assessmentResult}, generate a structured personalizedLearningPlan. The plan should include multiple learning steps such as 'concept', 'practice', 'assessment', or 'enhancement'. Each entry should include: subject name (e.g., Coding - Variables, Data Types, Arrays), step (concept, practice, assessment, or enhancement), description (brief explanation of the step), relevantActions (if applicable), and learningResources (tutorials, videos, exercises, or quizzes). Ensure your response uses these exact field names and is formatted as valid JSON.`;
    
    // Get AI response
    const aiFeedback = await getAiTutorResponse(aiPrompt);
    
    // Process the AI response to extract and format the personalized learning plan
        const personalizedLearningPlan = parseAiLearningPlanResponse(aiFeedback);
        const assessmentData = {
            ...assessmentResult,
            personalizedLearningPlan
        };


        const savedAssessment = await Assessment.create(assessmentData);

        return { 
            assessmentResult: savedAssessment, 
            rawAiResponse: aiFeedback 
        }
}


export function parseAiLearningPlanResponse(rawResponse: any): any[] {
    // Check if rawResponse is an array and has at least one element
    if (!Array.isArray(rawResponse) || rawResponse.length === 0) {
        console.error('Invalid AI response structure');
        return [];
    }

    const responseText = rawResponse[0]?.generated_text || '';

    // Extract JSON using regex, allowing for more flexible parsing
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)```/);
    
    if (!jsonMatch) {
        // Fallback to direct parsing if no code block found
        try {
            return parse(responseText);
        } catch (directParseError) {
            console.error('Failed to parse AI response:', directParseError);
            return [];
        }
    }

    try {
        // Use json5 for more lenient parsing
        const parsedLearningPlan = parse(jsonMatch[1]);

        // Normalize the learning plan structure
        return parsedLearningPlan.map((item: { subjectName: any; subject: any; step: any; description: any; relevantActions: any; learningResources: { [s: string]: unknown; } | ArrayLike<unknown>; }) => ({
            subject: item.subjectName || item.subject || 'Unknown Subject',
            step: item.step || 'concept',
            description: item.description || '',
            actions: Array.isArray(item.relevantActions) 
                ? item.relevantActions 
                : (item.relevantActions ? [item.relevantActions] : []),
            resources: Array.isArray(item.learningResources) 
                ? item.learningResources 
                : (item.learningResources ? Object.values(item.learningResources).flat() : [])
        }));
    } catch (parseError) {
        console.error('Error parsing learning plan:', parseError);
        return [];
    }
}