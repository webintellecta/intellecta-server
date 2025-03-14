import Jwt from "jsonwebtoken";
import CustomError from "./customErrorHandler";

// const TokenSecret = process.env.TOKEN_SECRET;

export const generateToken = (userId: string | unknown): string => {
  if (!process.env.TOKEN_SECRET) {
    throw new CustomError(
      "token secret is not defined in the environment variables",
      404
    );
  }
  return Jwt.sign({ _id: userId }, process.env.TOKEN_SECRET, { expiresIn: "1h" });
};
