import express from 'express'
import { userRegistration } from '../controllers/authController'
import { asyncHandler } from '../middleware/asyncHandler'



const userServiceRouter = express.Router()

userServiceRouter.post("/register", asyncHandler(userRegistration))



export default userServiceRouter