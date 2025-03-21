import axios from "axios";
import AssessmentQuestion from "../models/questionModel";
import { determineUserLevel } from "../utils/userLevel";
import CustomError from "../utils/customError";
import { getAiTutorResponse } from "../utils/huggingFaceService";
import { Document } from "mongoose";
import Assessment from "../models/assessmentModel";

interface QuestionDocument extends Document {
    _id: string;
    subject: string;
    correctAnswer: string; 
    
}

export const getAssessmentQuesService = async (userId?: string) => {
    if (!userId) {
        throw new CustomError("Unauthorized: No user ID found", 401);
    }

    const userServiceUrl = `${process.env.USER_SERVICE_URL}`;
    const userResponse = await axios.get(userServiceUrl);

    if (userResponse.status !== 200) {
        throw new CustomError("Failed to fetch user details", 400);
    }

    const { age } = userResponse.data.data.user;
    const level = determineUserLevel(age);

    const questions = await AssessmentQuestion.find({ difficulty: level }).limit(10).lean();

    return { userId, age, level, questions };
};

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
    const aiPrompt = ` Assess this user's learning level and suggest a personalized learning path: ${JSON.stringify(assessmentResult)}`;
    const aiFeedback = await getAiTutorResponse(aiPrompt);
    
    // Define the proper types for parsedFeedback
    interface PersonalizedRecommendation {
        subject: string;
        action: string;
        resources: string[];
    }
    
    interface ParsedFeedback {
        learningPath: string[];
        personalizedRecommendations: PersonalizedRecommendation[];
    }
    
    // Initialize with proper types
    let parsedFeedback: ParsedFeedback = {
        learningPath: [],
        personalizedRecommendations: []
    };

    try {
        if (aiFeedback && aiFeedback[0] && aiFeedback[0].generated_text) {
            const rawText = aiFeedback[0].generated_text;
            
            // Extract learning path steps
            const learningPathRegex = /\d+\.\s+(Begin with|For|Additionally|Lastly)[^0-9\n]+/g;
            const learningPathMatches = [...rawText.matchAll(learningPathRegex)];
            
            if (learningPathMatches && learningPathMatches.length > 0) {
                parsedFeedback.learningPath = learningPathMatches.map(match => 
                    match[0].trim().replace(/^\d+\.\s+/, '')
                ).slice(0, 4); // Take up to 4 learning path steps
            }
            
            // Extract subject-specific recommendations
            const subjects = ["science", "coding", "history", "reading"];
            
            parsedFeedback.personalizedRecommendations = subjects.map(subject => {
                const subjectRegex = new RegExp(`(${subject})[^.]*\\.`, 'i');
                const actionMatch = rawText.match(subjectRegex);
                const action = actionMatch ? actionMatch[0].trim() : `Improve ${subject} skills`;
            
                const resourceRegex = new RegExp(`(Khan Academy|Codecademy|W3Schools|TED-ED|Storyblock)[^.]*${subject}[^.]*\\.`, 'i');
                const resourceMatches = [...rawText.matchAll(new RegExp(resourceRegex, 'gi'))];
                
                const resources = resourceMatches.length > 0 
                    ? resourceMatches.map(m => m[0].trim()).slice(0, 2) 
                    : [`Online ${subject} courses`, `${subject} practice exercises`];
                
                return {
                    subject,
                    action,
                    resources
                };
            });
        }
    } catch (error) {
        console.error("Error parsing AI feedback:", error);
    }
    const savedAssessment = await Assessment.create({
        ...assessmentResult,
        learningPath: parsedFeedback.learningPath || [],
        personalizedRecommendations: parsedFeedback.personalizedRecommendations || []
    });
    
    return { assessmentResult: savedAssessment };
}