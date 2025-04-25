import express from "express";
import { adminDashboard, getTopPerfomingStudents } from "../controllers/adminController";
import { asyncHandler } from "../middleware/asyncHandler";

import { getallUsers } from "../controllers/adminAllUsersController";
import { isAdmin, isAuthenticate } from "../middleware/verifyToken";

const adminServiceRouter = express.Router();

adminServiceRouter.get("/adminDashboard",isAuthenticate,isAdmin, asyncHandler(adminDashboard));
adminServiceRouter.get("/users",isAuthenticate,isAdmin, asyncHandler(getallUsers))
adminServiceRouter.get("/users/topPerformers",isAuthenticate,isAdmin, asyncHandler(getTopPerfomingStudents))



export default adminServiceRouter;
