// import axios from "axios";
// import dotenv from "dotenv";

// dotenv.config();

// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
// const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

// export const analyzeAssessment = async (userResponses: { [key: number]: string }) => {
//   const response = await axios.post(
//     OPENAI_URL,
//     {
//       model: "gpt-4",
//       messages: [
//         { role: "system", content: "You are an educational AI. Grade the student's answers and determine their learning level." },
//         { role: "user", content: JSON.stringify(userResponses) },
//       ],
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${OPENAI_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );

//   return response.data.choices[0].message.content;
// };


import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

export const getPersonalizedLearningPath = async (userResponses: { [key: number]: string }) => {
  const prompt = `
    You are an AI tutor. Based on the user's responses, generate a personalized learning path. 
    Assess their knowledge level and suggest courses, exercises, and resources.

    User Responses: ${JSON.stringify(userResponses)}
    
    Format the response as:
    {
      "level": "beginner" | "intermediate" | "advanced",
      "recommendations": [
        { "title": "Course 1", "description": "Description", "link": "URL" },
        { "title": "Exercise 1", "description": "Description", "link": "URL" }
      ]
    }
  `;

  const response = await axios.post(
    OPENAI_URL,
    {
      model: "gpt-4",
      messages: [{ role: "system", content: prompt }],
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return JSON.parse(response.data.choices[0].message.content);
};


// import { Request, Response } from "express";
// import { getPersonalizedLearningPath } from "../services/aiService";
// import LearningPath from "../models/LearningPath";

// export const generateLearningPath = async (req: Request, res: Response) => {
//   try {
//     const { userId, responses } = req.body;

//     // Call AI Service to generate personalized recommendations
//     const aiResponse = await getPersonalizedLearningPath(responses);

//     // Save learning path in database
//     const learningPath = await LearningPath.create({
//       userId,
//       level: aiResponse.level,
//       recommendations: aiResponse.recommendations,
//     });

//     res.json({ message: "Personalized Learning Path Generated", learningPath });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to generate learning path" });
//   }
// };


// import mongoose, { Schema, Document } from "mongoose";

// interface ILearningPath extends Document {
//   userId: string;
//   level: "beginner" | "intermediate" | "advanced";
//   recommendations: { title: string; description: string; link: string }[];
// }

// const LearningPathSchema: Schema = new Schema(
//   {
//     userId: { type: String, required: true },
//     level: { type: String, enum: ["beginner", "intermediate", "advanced"], required: true },
//     recommendations: [{ title: String, description: String, link: String }],
//   },
//   { timestamps: true }
// );

// const LearningPath = mongoose.model<ILearningPath>("LearningPath", LearningPathSchema);
// export default LearningPath;


// export const updateLearningPath = async (req: Request, res: Response) => {
//     try {
//       const { userId, progress } = req.body;
  
//       // AI Re-evaluation
//       const updatedRecommendations = await getPersonalizedLearningPath(progress);
  
//       // Update learning path
//       await LearningPath.findOneAndUpdate({ userId }, { recommendations: updatedRecommendations });
  
//       res.json({ message: "Learning path updated", recommendations: updatedRecommendations });
//     } catch (error) {
//       res.status(500).json({ error: "Failed to update learning path" });
//     }
//   };
  