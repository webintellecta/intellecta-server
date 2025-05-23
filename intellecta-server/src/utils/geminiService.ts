import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import CustomError from "./customErrorHandler";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const generateQuizzes = async (prompt: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    console.error("Gemini Error:", error);

    if (error.status === 429) {
      throw new CustomError("API quota exceeded. Please try again later.", 429);
    }
    throw new CustomError("Error generating learning path.", 500);
  }
};


// export const generateLearningPath = async (prompt: string) => {
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
//     const result = await model.generateContent(prompt);
//     return result.response.text();
//   } catch (error) {
//     console.error("Gemini Error:", error);
//     return "Error generating learning path.";
//   }
// };

export const generateLearningPath = async (prompt: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    // Detect quota exceeded error based on error message or status code
    if (error.status === 429) {
      console.error("Gemini quota exceeded:", error.message);
      throw new Error("API quota exceeded. Please try again later.");
    }
    console.error("Gemini Error:", error);
    throw new Error("Error generating learning path.");
  }
};


// import { openai } from '../config/openai'; // or however you’ve configured it

// export const generateQuizzes = async (prompt: string): Promise<string> => {
//     const completion = await openai.chat.completions.create({
//         model: "gpt-4",
//         messages: [{ role: "user", content: prompt }],
//         temperature: 0.7,
//     });
//     return completion.choices[0].message.content!;
// };
