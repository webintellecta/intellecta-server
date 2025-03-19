import { Request, Response } from "express";
import { getUserByIdService, profilePictureService } from "../service/userFucntionService";
import CustomError from "../utils/customErrorHandler";
import User from "../models/userModel";

export const getUserById = async (req:Request , res:Response) => {
    const userId = req.params.id
    if(!userId){
        throw new CustomError("user not found",404)
    }
    const userData = await getUserByIdService(userId)
    return res.status(200).json({success:true, message:userData.message, data:userData})
}


interface AuthenticatedRequest extends Request {
    user?: { userId: string }; // Ensures `req.user` contains `userId`
}

export const profilePictureController = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
        console.log("file", req.file);
        console.log("Authenticated user ID:", req.user?.userId);

        const userId = req.user?.userId;
        if (!userId) {
            return res.status(400).json({ status: "error", message: "User ID is required" });
        }

        const result = await profilePictureService(userId, req.file as Express.Multer.File);
        console.log("final uploaded url", result);

        return res.status(200).json({
            status: "success",
            message: "Uploaded Successfully",
            data: result,
        });
    }


export const getAllUsers = async (req:Request , res:Response) => {
    const allUsers = await User.find()
    if(!allUsers){
        throw new CustomError("user data not found",404)
    }
    return res.status(200).json({message:"fetch  done", data:allUsers})
}