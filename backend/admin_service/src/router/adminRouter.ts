import express from "express";
import { adminDashboard } from "../controllers/adminController";
import { asyncHandler } from "../middleware/asyncHandler";

import { isAuthenticate } from "../middleware/verifyToken"; 
import { getallUsers } from "../controllers/adminAllUsersController";

const adminServiceRouter = express.Router();

adminServiceRouter.get("/adminDashboard",isAuthenticate, asyncHandler(adminDashboard));
adminServiceRouter.get("/users",isAuthenticate, asyncHandler(getallUsers))



export default adminServiceRouter;
