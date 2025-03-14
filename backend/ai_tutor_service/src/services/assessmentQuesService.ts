import axios from "axios";
import AssessmentQuestion from "../models/questionModel";
import { determineUserLevel } from "../utils/userLevel";
import CustomError from "../utils/customError";

export const getAssessmentQuesService = async (userId?: string) => {
    if (!userId) {
        throw new CustomError("Unauthorized: No user ID found", 401);
    }

    const userServiceUrl = `${process.env.USER_SERVICE_URL}/${userId}`;
    const userResponse = await axios.get(userServiceUrl);

    if (userResponse.status !== 200) {
        throw new CustomError("Failed to fetch user details", 400);
    }

    const { age } = userResponse.data.data.user;
    const level = determineUserLevel(age);

    const questions = await AssessmentQuestion.find({ difficulty: level }).limit(10).lean();

    return { userId, age, level, questions };
};