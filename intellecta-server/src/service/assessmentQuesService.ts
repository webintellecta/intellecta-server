import AssessmentQuestion from "../models/questionModel";
import { determineUserLevel } from "../utils/userLevel";
import CustomError from "../utils/customErrorHandler";
import { Document } from "mongoose";
import Assessment from "../models/assessmentModel";
import { generateLearningPath } from "../utils/geminiService";
import User from "../models/userModel";

interface QuestionDocument extends Document {
    _id: string;
    subject: string;
    correctAnswer: string; 
}

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

export const getAssessmentQuesService = async (userId?: string) => {
    console.log("user id", userId)
    console.log("entering to the service")
    if (!userId) {
        throw new CustomError("Unauthorized: No user ID found", 401);
    }
    let userData = await User.findById(userId)

    if (!userData) {
        throw new CustomError("User data not found. Try again later.", 400);
    }

  
    const  age  = userData.age;
    const level = determineUserLevel(age);
    const questions = await AssessmentQuestion.find({ difficulty: level }).limit(15).lean();
    console.log("questions", questions)
    return { userId, age, level, questions };
};

// export const evaluateAssessmentService = async(id:string, data: any) => {
//     const userId = id;
//     console.log("consolling userId: ", userId);
//     const {answers} = data;
//     console.log("ffff", data);
    
//     if (!userId || !answers || !Array.isArray(answers)) {
//         throw new CustomError("Invalid input data", 400);
//     }
//     const questionIds = answers.map(a => a._id);
//     const questions: QuestionDocument[] = await AssessmentQuestion.find({ _id: { $in: questionIds } });
//     let correctCount = 0;
//     let subjectScores: Record<string, number> = {};

//     questions.forEach(question => {
//         if (!subjectScores[question.subject]) {
//             subjectScores[question.subject] = 0;
//         }
//     });

//     answers.forEach(userAnswer => {
//         const question = questions.find(q => q._id.toString() === userAnswer._id);
//         if (question && question.correctAnswer === userAnswer.selectedOption) {
//             correctCount++;
//             subjectScores[question.subject] += 1;
//         }
//     });

//     const totalQuestions = questions.length;
//     const scorePercentage = (correctCount / totalQuestions) * 100;

//     const allSubjects = Object.keys(subjectScores);
//     const strengthThreshold = 2;

//     let strengths = allSubjects.filter(subj => subjectScores[subj] >= strengthThreshold);
//     let weaknesses = allSubjects.filter(subj => subjectScores[subj] < strengthThreshold);

//     const assessmentResult = {
//         userId,
//         totalQuestions,
//         correctCount,
//         scorePercentage,
//         strengths,
//         weaknesses,
//         subjectScores
//     };

//     const prompt = `
//     Create a personalized learning roadmap for a student aged 5-18 based on the assessment results:
//     ${JSON.stringify(assessmentResult)}
    
//     Generate a JSON with:
//     {
//         "learningPaths": [
//             {
//                 "subject": "Science/Coding/Math/History/English",
//                 "currentLevel": "beginner/intermediate/advanced",
//                 "learningGoals": [
//                     "Primary learning objective",
//                     "Secondary learning objective"
//                 ],
//                 "resources": [
//                     {
//                         "type": "course/video/project",
//                         "title": "Resource name",
//                         "difficulty": "beginner/intermediate/advanced",
//                         "link": "platform-resource-link"
//                     }
//                 ]
//             }
//         ],
//         "nextSteps": [
//             "First learning recommendation",
//             "Follow-up recommendation"
//         ],
//         "motivationalNote": "Encouraging message for the student"
//     }
    
//     Key Requirements:
//     - Personalized and engaging
//     - Practical learning resources
//     - Clear, actionable learning path
//     `;

//     const aiResponse = await generateLearningPath(prompt);

//     let parsedAiResponse;
//     try {
//         const cleanedResponse = aiResponse
//             .replace(/```json?/g, '')
//             .replace(/```/g, '')
//             .trim();
        
//         parsedAiResponse = JSON.parse(cleanedResponse);

//         if (!Array.isArray(parsedAiResponse.learningPaths) || parsedAiResponse.learningPaths.length === 0) {
//             throw new Error('No learning paths found');
//         }
//     } catch (error) {
//         console.error('Failed to parse AI response:', error);
//         throw new CustomError('Invalid AI response format', 500);
//     }

//     const savedAssessment = new Assessment({
//         userId,
//         totalQuestions,
//         correctCount,
//         scorePercentage,
//         strengths,
//         weaknesses,
//         subjectScores,
//         aiResponse: parsedAiResponse,
//     });

//     await savedAssessment.save();
//     return { assessmentResult: savedAssessment };
// }

// export const evaluateAssessmentService = async (id: string, data: any) => {
//     const userId = id;
//     const { answers } = data;

//     if (!userId || !answers || !Array.isArray(answers)) {
//         throw new CustomError("Invalid input data", 400);
//     }

//     const questionIds = answers.map(a => a._id);
//     const questions: QuestionDocument[] = await AssessmentQuestion.find({ _id: { $in: questionIds } });

//     let correctCount = 0;
//     let subjectScores: Record<string, number> = {};

//     questions.forEach(question => {
//         if (!subjectScores[question.subject]) {
//             subjectScores[question.subject] = 0;
//         }
//     });

//     answers.forEach(userAnswer => {
//         const question = questions.find(q => q._id.toString() === userAnswer._id);
//         if (question && question.correctAnswer === userAnswer.selectedOption) {
//             correctCount++;
//             subjectScores[question.subject] += 1;
//         }
//     });

//     const totalQuestions = questions.length;
//     const scorePercentage = (correctCount / totalQuestions) * 100;
//     const allSubjects = Object.keys(subjectScores);
//     const strengthThreshold = 2;

//     const strengths = allSubjects.filter(subj => subjectScores[subj] >= strengthThreshold);
//     const weaknesses = allSubjects.filter(subj => subjectScores[subj] < strengthThreshold);

//     const assessmentResult = {
//         userId,
//         totalQuestions,
//         correctCount,
//         scorePercentage,
//         strengths,
//         weaknesses,
//         subjectScores
//     };

//     const prompt = `
//     Create a personalized learning roadmap for a student aged 5-18 based on the assessment results:
//     ${JSON.stringify(assessmentResult)}
    
//     Generate a JSON with:
//     {
//         "learningPaths": [
//             {
//                 "subject": "Science/Coding/Math/History/English",
//                 "currentLevel": "beginner/intermediate/advanced",
//                 "learningGoals": [
//                     "Primary learning objective",
//                     "Secondary learning objective"
//                 ],
//                 "resources": [
//                     {
//                         "type": "course/video/project",
//                         "title": "Resource name",
//                         "difficulty": "beginner/intermediate/advanced",
//                         "link": "platform-resource-link"
//                     }
//                 ]
//             }
//         ],
//         "nextSteps": [
//             "First learning recommendation",
//             "Follow-up recommendation"
//         ],
//         "motivationalNote": "Encouraging message for the student"
//     }
//     `;

//     let aiResponse: string;
//     try {
//         aiResponse = await generateLearningPath(prompt);
//     } catch (err) {
//         console.error("AI generation error:", err);
//         throw new CustomError('AI failed to generate roadmap. Please try again later.', 500);
//     }

//     let parsedAiResponse;
//     try {
//         const cleanedResponse = aiResponse
//             .replace(/```json?/g, '')
//             .replace(/```/g, '')
//             .trim();

//         parsedAiResponse = JSON.parse(cleanedResponse);

//         if (
//             !parsedAiResponse ||
//             !Array.isArray(parsedAiResponse.learningPaths) ||
//             parsedAiResponse.learningPaths.length === 0
//         ) {
//             throw new Error('AI response missing learning paths');
//         }
//     } catch (error) {
//         console.error('Failed to parse AI response:', error);
//         throw new CustomError('Invalid AI response format', 500);
//     }

//     const savedAssessment = new Assessment({
//         userId,
//         totalQuestions,
//         correctCount,
//         scorePercentage,
//         strengths,
//         weaknesses,
//         subjectScores,
//         aiResponse: parsedAiResponse,
//     });

//     await savedAssessment.save();
//     return { assessmentResult: savedAssessment };
// };

export const evaluateAssessmentService = async (id: string, data: any) => {
    const userId = id;
    const { answers } = data;

    if (!userId || !answers || !Array.isArray(answers)) {
        throw new CustomError("Invalid input data", 400);
    }

    const questionIds = answers.map(a => a._id);
    const questions: QuestionDocument[] = await AssessmentQuestion.find({ _id: { $in: questionIds } });

    let correctCount = 0;
    let subjectScores: Record<string, number> = {};

    questions.forEach(question => {
        if (!subjectScores[question.subject]) {
            subjectScores[question.subject] = 0;
        }
    });

    answers.forEach(userAnswer => {
        const question = questions.find(q => q._id.toString() === userAnswer._id);
        if (question && question.correctAnswer === userAnswer.selectedOption) {
            correctCount++;
            subjectScores[question.subject] += 1;
        }
    });

    const totalQuestions = questions.length;
    const scorePercentage = (correctCount / totalQuestions) * 100;
    const allSubjects = Object.keys(subjectScores);
    const strengthThreshold = 2;

    const strengths = allSubjects.filter(subj => subjectScores[subj] >= strengthThreshold);
    const weaknesses = allSubjects.filter(subj => subjectScores[subj] < strengthThreshold);

    const assessmentResult = {
        userId,
        totalQuestions,
        correctCount,
        scorePercentage,
        strengths,
        weaknesses,
        subjectScores
    };

    const prompt = `
    Create a personalized learning roadmap for a student aged 5-18 based on the assessment results:
    ${JSON.stringify(assessmentResult)}

    Generate a JSON with:
    {
        "learningPaths": [
            {
                "subject": "Science/Coding/Math/History/English",
                "currentLevel": "beginner/intermediate/advanced",
                "learningGoals": [
                    "Primary learning objective",
                    "Secondary learning objective"
                ],
                "resources": [
                    {
                        "type": "course/video/project",
                        "title": "Resource name",
                        "difficulty": "beginner/intermediate/advanced",
                        "link": "platform-resource-link"
                    }
                ]
            }
        ],
        "nextSteps": [
            "First learning recommendation",
            "Follow-up recommendation"
        ],
        "motivationalNote": "Encouraging message for the student"
    }
    `;

    let aiResponse: string;
    try {
        aiResponse = await generateLearningPath(prompt);
    } catch (err) {
        console.error("AI generation error:", err);
        throw new CustomError('AI failed to generate roadmap. Please try again later.', 500);
    }

    let parsedAiResponse;
    try {
        const cleanedResponse = aiResponse
            .replace(/```json?/g, '')
            .replace(/```/g, '')
            .trim();

        // Check if it is likely valid JSON before parsing
        if (!cleanedResponse.startsWith('{')) {
            throw new Error("AI response is not valid JSON");
        }

        parsedAiResponse = JSON.parse(cleanedResponse);

        if (
            !parsedAiResponse ||
            !Array.isArray(parsedAiResponse.learningPaths) ||
            parsedAiResponse.learningPaths.length === 0
        ) {
            throw new Error('AI response missing learning paths');
        }
    } catch (error) {
        console.error('Failed to parse AI response:', error);
        throw new CustomError('Invalid AI response format', 500);
    }

    const savedAssessment = new Assessment({
        userId,
        totalQuestions,
        correctCount,
        scorePercentage,
        strengths,
        weaknesses,
        subjectScores,
        aiResponse: parsedAiResponse,
    });

    await savedAssessment.save();
    return { assessmentResult: savedAssessment };
};
