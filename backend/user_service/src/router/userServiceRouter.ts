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
import { getAllUsers, getUserById } from "../controllers/userController";
import { isAuthenticate } from "../middleware/isAuth";

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
  asyncHandler(getUserById)
);

userServiceRouter.get("/getAllUsers", asyncHandler(getAllUsers))

//forgot-password ==
userServiceRouter.post("/forgotpassword/:id", asyncHandler(forgotPassword));
userServiceRouter.post('/resetPassword', asyncHandler(resetPassword));

// ===
//access token to refresh token
userServiceRouter.post("/refreshaccesstoken", asyncHandler(refreshTokeToAccessToken))

export default userServiceRouter;
