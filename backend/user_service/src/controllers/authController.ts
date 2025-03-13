import { Request, Response } from "express";
import { changePasswordService, loginUserService, logOutUserService, registerUser } from "../service/authService";
import CustomError from "../utils/customErrorHandler";

//registeration
export const userRegistration = async (req: Request, res: Response) => {
  const data = await registerUser(req.body, res);
  if (!data) {
    throw new CustomError("registration failed", 404);
  }
  return res
    .status(200)
    .json({ success: true, message: "user registered successfully" ,data:data });
};




//login
export const userLogin = async (req: Request, res: Response) => {
  const loginData = await loginUserService(req.body, res);
  return res.status(200).json({ message: "user logged in", data: loginData });
};

//logout
export const userLogout = async (req:Request, res:Response) => {
  const userData = await logOutUserService(req.body, res)
  return res.status(200).json({message:"user logged out", data:userData})
}

//changePassword
export const userChangePassword = async (req:Request, res:Response) => {
  const userId = req.user
  const changePsswdData = await changePasswordService(userId , req.body)
  return res.status(200).json({message:"password changed"})
}

