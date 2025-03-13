import express from 'express'
import { userRegistration } from '../controllers/authController'
import { asyncHandler } from '../middleware/asyncHandler'
import { getUserById } from '../controllers/userController'



const userServiceRouter = express.Router()

userServiceRouter.post("/register", asyncHandler(userRegistration))
userServiceRouter.get("/getuserbyid/:id", asyncHandler(getUserById))



export default userServiceRouter