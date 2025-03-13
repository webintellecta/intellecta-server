import { Request, Response } from "express";
import { loginUserService, registerUser } from "../service/authService";
import CustomError from "../utils/customErrorHandler";

export const userRegistration = async (req: Request, res: Response) => {
  const data = await registerUser(req.body);
  if (!data) {
    throw new CustomError("registration failed", 404);
  }
  return res
    .status(200)
    .json({ success: true, message: "user registered successfully" });
};


export const userLogin = async (req: Request , res: Response) =>  {
    const loginData = await loginUserService(req.body)
      
   
}
