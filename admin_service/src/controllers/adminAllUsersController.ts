import { Request, Response } from "express";
import { publishToQueue } from "../utils/rabbitmq/rabbitmqPublish";
import CustomError from "../utils/CustomError";
import { users } from "../consumers/userConsumer";
import {getSpecificUserData} from "../consumers/specificUserConsumer"

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

export const getallUsers = async(req: AuthenticatedRequest, res: Response) => {

  const userId = req.user?.userId;
  console.log("first ");

  if (!userId) {
    throw new CustomError("User ID is required", 400);
  }
  console.log("second");

  await publishToQueue("allUserDetails", userId);

  await new Promise((resolve) => setTimeout(resolve, 1500));

  const allUsers = Array.from(users.values()).filter(user => !user.isDeleted);
  console.log("all users ",users);
  

  if (!allUsers.length) {
    return res.status(404).json({ message: "No users found." });
  }

  return res.status(200).json({
    success: true,
    message: "got all users",
    data: allUsers
  })


};


export const softDeleteUser = async(req:AuthenticatedRequest, res:Response) => {
  const admin = req.user?.userId;
  const {userId} = req.body

  if (!userId) {
    throw new CustomError("User ID is required", 400);
  }

  await publishToQueue("deleteUser", userId);

}
