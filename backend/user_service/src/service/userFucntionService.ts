import { JwtPayload } from "jsonwebtoken"
import User from "../models/userModel"
import CustomError from "../utils/customErrorHandler"
import { uploadToS3 } from "../middleware/profilePicUploader";

export const getUserByIdService = async(userId:string | undefined | JwtPayload) =>{
    const specificUser = await User.findById(userId)
    if(!specificUser){
        throw new CustomError("user not found", 404)
    }
    return{
        message:"user data fetched",
        user:specificUser
    }
}

//Profile Upload
export const profilePictureService = async (userId: string, file: Express.Multer.File): Promise<string> => {
    if (!file) {
        throw new CustomError("No file uploaded", 400);
    }
    if (!userId) {
        throw new CustomError("User ID is required", 400);
    }

    // Upload image to S3 and get URL
    const fileUrl: string = await uploadToS3(file);

    // ✅ Update user profile picture in database
    const user = await User.findByIdAndUpdate(userId, { profilePic: fileUrl }, { new: true });

    if (!user) {
        throw new CustomError("User not found", 404);
    }

    return fileUrl;
};


