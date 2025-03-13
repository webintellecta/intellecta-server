import { Response } from "express";
import User from "../models/userModel";
import CustomError from "../utils/customErrorHandler";
import { generateToken } from "../utils/jwt";
import { comparePassword, hashPassword } from "../utils/passwordHash";
import { JwtPayload } from "jsonwebtoken";


//user register
export const registerUser = async (data: any , res:Response) => {
  if (!data) {
    throw new CustomError("input datas not found", 404);
  }
  const userEmail = data.email;
  const existUser = await User.findOne({ email: userEmail });
  if (existUser) {
    throw new CustomError(
      "user with this email already exist, pleasee try another email",
      404
    );
  }
  if (data.age < 5 || data.age > 18) {
    throw new CustomError("you are not eligible to create account", 404);
  }
  const passwordHash = await hashPassword(data.Password);
  if (!passwordHash) {
    throw new CustomError("password encryption failed", 404);
  }
  const newUser = new User({
    name: data.name,
    email: data.email,
    password: passwordHash,
    profile: data.profile,
    age: data.age,
    phone: data.phone,
  });
  await newUser.save();

  const token =  generateToken(newUser._id)
  res.cookie("token", token,{
    httpOnly: true,
    secure: false,
  })

  return { message: "user registered successfully", token:token };
};




//login
interface LoginData {
  email: string;
  password: string;
}

// Define return type
interface LoginResponse {
  message: string;
  token: string;
  user: {
      id: string;
      name: string;
      email: string;
  };
}

// Type your User model (assuming it’s defined elsewhere)
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  age: number;
  _id: import("mongoose").Types.ObjectId;
}

export const loginUserService = async (data: LoginData , res:Response): Promise<LoginResponse> => {
  const userExist = await User.findOne({ email: data.email }).select("password") as IUser | null;
  if (!userExist) {
      throw new CustomError("User not found, please register", 404);
  }

  const validateUser = await comparePassword(data.password, userExist.password);

  if (!validateUser) {
      throw new CustomError("Incorrect password", 401); // 401 for unauthorized
  }

  const token = generateToken(userExist._id.toString()); // Convert ObjectId to string

  res.cookie("token",token,{
    httpOnly: true,
    secure: false,
  })
  return {
      message: "User logged in", // Fixed typo: "loggined" → "logged in"
      token, // No .toString() needed
      user: {
          id: userExist._id.toString(), // Convert to string for consistency
          name: userExist.name,
          email: userExist.email,
      },
  };
};


export const logOutUserService = async(data:any , res:Response)=>{
  res.clearCookie("token",{
    httpOnly: true, // Match the settings from login
      secure: false,
  })
  return {message:"user logged out"}
}

// export const changePasswordService = async (id:string | undefined | JwtPayload , data:any ) => {
//     const newPassword = data.Password
//     const currentUser = await User.findById(id).select("password")
//     const  currentPassword:string  = currentUser?.password
//     const passwordCheck = await comparePassword(newPassword , currentPassword )


// }