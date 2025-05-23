import { Request, Response } from "express";
import CustomError from "../../utils/customErrorHandler";
import User from "../../models/userModel";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

export const getallUsers = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  console.log("first ");

  if (!userId) {
    throw new CustomError("User ID is required", 400);
  }

  const allUsers = await User.find({}, { password: 0 }); // Exclude sensitive fields

  if (!allUsers.length) {
    return res.status(404).json({ message: "No users found." });
  }

  return res.status(200).json({
    success: true,
    message: "got all users",
    data: allUsers,
  });
};

export const softDeleteUser = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const admin = req.user?.userId;
  const { userId } = req.body;

  if (!userId) {
    throw new CustomError("User ID is required", 400);
  }
  const deletedUser = await User.findByIdAndUpdate(
    userId,
    { $set: { isDeleted: true } },
    { new: true }
  );
  return res.status(200).json({
    success: true,
    message: "user deleted",
  });
};
