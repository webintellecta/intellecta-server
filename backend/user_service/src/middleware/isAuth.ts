import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import CustomError from "../utils/customErrorHandler";
//verifying the token


interface DecodedToken {
    [key: string]: any;
  }
  
  interface CustomRequest extends Request {
    user?: DecodedToken;
  }


export const isAuthenticate = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
    const token = req.cookies.token
    if(!token){
        throw new CustomError("token is not exist in the cookie", token)
    }
    jwt.verify(token, process.env.TOKEN_SECRET as string, (err : any, decoded: any)=>{
        if(err){
            throw new CustomError("token verification failed",404)
        }

        req.user = decoded as DecodedToken
        next()
    })
};
