import express from "express";
import {
  forgotPassword,
  refreshTokeToAccessToken,
  resetPassword,
  userChangePassword,
  userLogin,
  userLogout,
  userRegistration,
} from "../controllers/authController";
import { asyncHandler } from "../middleware/asyncHandler";
import { getUserById, profilePictureController } from "../controllers/userController";
import { isAuthenticate } from "../middleware/isAuth";
import {upload} from "../middleware/profilePicUploader"

const userServiceRouter = express.Router();

userServiceRouter.post("/register", asyncHandler(userRegistration));
userServiceRouter.post("/login", asyncHandler(userLogin));
userServiceRouter.post("/logout", asyncHandler(userLogout));

userServiceRouter.patch(
  "/changepassword",
  isAuthenticate,
  asyncHandler(userChangePassword)
);
userServiceRouter.get(
  "/getuserbyid/:id",
  isAuthenticate,
  asyncHandler(getUserById)
);

//forgot-password
userServiceRouter.post("/forgotpassword/:id", asyncHandler(forgotPassword));
userServiceRouter.post('/resetPassword', asyncHandler(resetPassword));


//profile-upload
userServiceRouter.post(
    '/upload-profile', 
    isAuthenticate, 
    upload.single('image'), 
    asyncHandler(profilePictureController));
//access token to refresh token
userServiceRouter.post("/refreshaccesstoken", asyncHandler(refreshTokeToAccessToken))

export default userServiceRouter;
