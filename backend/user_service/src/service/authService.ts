import User from "../models/userModel";
import CustomError from "../utils/customErrorHandler";
import { generateToken } from "../utils/jwt";
import { comparePassword, hashPassword } from "../utils/passwordHash";

export const registerUser = async (data: any) => {
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
  return { message: "user registered successfully" };
};






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

export const loginUserService = async (data: LoginData): Promise<LoginResponse> => {
  const userExist = await User.findOne({ email: data.email }) as IUser | null;
  if (!userExist) {
      throw new CustomError("User not found, please register", 404);
  }

  const validateUser = await comparePassword(data.password, userExist.password);
  if (!validateUser) {
      throw new CustomError("Incorrect password", 401); // 401 for unauthorized
  }

  const token = generateToken(userExist._id.toString()); // Convert ObjectId to string

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