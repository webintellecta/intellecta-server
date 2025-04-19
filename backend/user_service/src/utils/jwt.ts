import Jwt, { JwtPayload } from "jsonwebtoken";
import CustomError from "./customErrorHandler";

export const generateToken = (
  userId: string | unknown,
  age: number
): string => {
  console.log("generate age", age);
  if (!process.env.TOKEN_SECRET) {
    console.log("within if", process.env.TOKEN_SECRET);
    throw new CustomError(
      "token secret is not defined in the environment variables",
      404
    );
  }
  return Jwt.sign({ _id: userId, age: age }, process.env.TOKEN_SECRET, {
    expiresIn: "1h",
  });
};

//generaterefreshtoken
export const generateRefreshToken = (
  userId: string | unknown,
  age: number
): string => {
  console.log("generating token", process.env.REFRESH_TOKEN_SECRET);
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new CustomError(
      "refresh token is not defined in the environment variables",
      404
    );
  }
  return Jwt.sign({ _id: userId, age: age }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1h",
  });
};

interface CustomJwtPayload extends JwtPayload {
  _id: string;
}

export const verifyToken = (token: string, tokenSecret: string) => {
  const decoded = Jwt.verify(token, tokenSecret) as CustomJwtPayload;
  console.log("verify decoded", decoded);
  if (typeof decoded === "string" || !("_id" in decoded)) {
    throw new CustomError("Invalid token payload", 404);
  }
  return {
    _id: decoded._id,
    age: decoded.age, // you can now use this directly
  };
};

export const generateAdminToken = (userId: string | unknown): string => {
  if (!process.env.TOKEN_SECRET) {
    throw new CustomError(
      "Token secret is not defined in the environment variables",
      404
    );
  }
  if (typeof userId !== "string" || !userId) {
    throw new CustomError(
      "Invalid or missing user ID for token generation",
      400
    );
  }
  return Jwt.sign({ _id: userId }, process.env.TOKEN_SECRET, {
    expiresIn: "1h",
  });
};
