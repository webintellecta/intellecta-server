import { NextFunction, Request,Response } from "express";
import CustomError from "../utils/CustomError";
import jwt, { JwtPayload } from "jsonwebtoken"

interface CustomRequest extends Request {
  user?: { userId: string, role: string };
}

export const isAuthenticate = async (req: CustomRequest,res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  if (!token) {
    return next(new CustomError("Token does not exist in the cookie", 401));
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.TOKEN_SECRET as string
    ) as JwtPayload;

    // ✅ Ensure `decoded` contains `userId`
    if (typeof decoded === "string" || !decoded._id) {
      return next(new CustomError("Invalid token payload", 401));
    }

    req.user = { userId: decoded._id , role: decoded.role};
    next();
  } catch (err) {
    return next(new CustomError(`Invalid or expired token ${err}`, 401));
  }
};


export const isAdmin = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== "admin") {
    return next(new CustomError("Access denied. Admins only.", 403));
  }
  next();
};
