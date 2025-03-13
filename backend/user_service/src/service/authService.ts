import User from "../models/userModel";
import CustomError from "../utils/customErrorHandler";
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




export const loginUserService = async (data: any) => {
  const userExist = await User.findOne({ email: data.email });
  if (!userExist) {
    throw new CustomError("user not found, Please login", 404);
  }

  const validateUser = await comparePassword(data.Password, userExist.password)

};
