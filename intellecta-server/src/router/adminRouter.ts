import express from "express";
import { adminDashboard, getTopPerfomingStudents } from "../controllers/Admin/adminController";
import { asyncHandler } from "../middleware/asyncHandler";

import { getallUsers } from "../controllers/Admin/adminAllUsersController";
import { isAdmin, isAuthenticate } from "../middleware/isAuth";

const adminServiceRouter = express.Router();

adminServiceRouter.get("/adminDashboard",isAuthenticate,isAdmin, asyncHandler(adminDashboard));
adminServiceRouter.get("/users",isAuthenticate,isAdmin, asyncHandler(getallUsers))
adminServiceRouter.get("/users/topPerformers",isAuthenticate,isAdmin, asyncHandler(getTopPerfomingStudents))



export default adminServiceRouter;
