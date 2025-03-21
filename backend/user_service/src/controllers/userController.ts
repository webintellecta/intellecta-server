import { Request, Response } from "express";
import { getUserByIdService } from "../service/userFucntionService";
import CustomError from "../utils/customErrorHandler";
import { publishToQueue } from "../utils/rabbitmq";

export const getUserById = async (req:Request , res:Response) => {
    const userId = req.params.id
    if(!userId){
        throw new CustomError("user not found",404)
    }
    const userData = await getUserByIdService(userId)

    
    // Publish event to RabbitMQ when user is fetched
    await publishToQueue("user_fetched", userData);

    return res.status(200).json({success:true, message:userData.message, data:userData})
}



