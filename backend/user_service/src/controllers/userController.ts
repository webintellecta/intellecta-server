import { Request, Response } from "express";
import { getUserByIdService } from "../service/userFucntionService";

export const getUserById = async (req:Request , res:Response) => {
    const userId = req.params.id
    const userData = await getUserByIdService(userId)
    return res.status(200).json({success:true, message:userData.message, data:userData})
}