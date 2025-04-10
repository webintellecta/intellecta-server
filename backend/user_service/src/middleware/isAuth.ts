import { NextFunction, Request, Response } from "express";
import jwt, {JwtPayload} from "jsonwebtoken";
import CustomError from "../utils/customErrorHandler";


//verifying the token
// interface DecodedToken {
//     [key: string]: any;
//   }
interface CustomRequest extends Request {
  user?: { userId: string }; 
}

export const isAuthenticate = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
    const token = req.cookies.token
    if(!token){
      throw new CustomError("Token does not exist in the cookie", 401);
    }
    try{
      const decoded =jwt.verify(token, process.env.TOKEN_SECRET as string) as JwtPayload;

      if (typeof decoded === "string" || !decoded._id) {
        throw new CustomError("Invalid token payload", 401);
      }
    
      req.user = { userId: decoded._id };
      next()
    }
    catch(err){
      throw new CustomError(`Invalid or expired token ${err}`, 401);
    }     
};