import express from "express";
import { adminDashboard } from "../controllers/adminController";
import { asyncHandler } from "../middleware/asyncHandler";

import { isAuthenticate } from "../middleware/verifyToken"; 

const adminServiceRouter = express.Router();

adminServiceRouter.get("/adminDashboard",isAuthenticate, asyncHandler(adminDashboard));



export default adminServiceRouter;
