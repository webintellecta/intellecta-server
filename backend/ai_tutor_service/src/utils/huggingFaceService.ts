import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const MODEL_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3";

interface AITutorResponse {
    generated_text: string;
  }
  

export const getAiTutorResponse = async (aiPrompt: string): Promise<AITutorResponse[]> => {
    try {
        const response = await axios.post(
            MODEL_URL,
            {
                inputs: aiPrompt
            },
            {
                headers: {
                    Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log('response', response.data)
        return response.data;
    } catch (error) {
        console.error("Error generating questions:", error);
        throw new Error("Failed to generate questions");
    }    
};