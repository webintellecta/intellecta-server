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
    res.status(200).json({success:true, message:userData.message, data:userData})
}

interface AuthenticatedRequest extends Request {
    user?: { userId: string }; 
}

export const profilePictureController = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    const userId = req.user?.userId;
    if (!userId) {
        throw new CustomError("User ID is required", 400);
    }
    const result = await profilePictureService(userId, req.file as Express.Multer.File);
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
        throw new CustomError("User ID is required", 400);
    }
    const response = await userEditService(userId, req.body);
    return res.status(200).json({
        status: "success",
        message: "User updated successfully",
        data: response,
    });
}


//bulk users 
export const getBulkUsers = async (req:Request, res:Response) :Promise<Response> => {
    const { userIds } = req.body;
    const users = await User.find({ _id: { $in: userIds } }, "_id name profilePic");    
    return res.json(users);
  };
  