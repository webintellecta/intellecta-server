import { Request, Response } from "express";
import { getUserByIdService, profilePictureService, userEditService  } from "../service/userService";
import CustomError from "../utils/customErrorHandler";
import User from "../models/userModel";

//Get User
export const getUserById = async (req:Request , res:Response) => {
    const userId = req.user?.userId;
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

//Edit User
export const userEditController = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
        const userId = req.user?.userId; 

        if (!userId) {
            return res.status(400).json({ status: "error", message: "User ID is required" });
        }

        console.log("Authenticated user ID:", userId);
        console.log("Received user update request:", req.body);

        const response = await userEditService(userId, req.body);

        console.log("Updated User Data:", response);

        return res.status(200).json({
            status: "success",
            message: "User updated successfully",
            data: response,
        });
    }

