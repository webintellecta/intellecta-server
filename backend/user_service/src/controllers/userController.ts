import { Request, Response } from "express";
import { getUserByIdService } from "../service/userFucntionService";
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

export const getAllUsers = async (req:Request , res:Response) => {
    const allUsers = await User.find()
    if(!allUsers){
        throw new CustomError("user data not found",404)
    }
    return res.status(200).json({message:"fetch  done", data:allUsers})
}