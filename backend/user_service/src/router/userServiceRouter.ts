import express from 'express'
import { userLogin, userLogout, userRegistration } from '../controllers/authController'
import { asyncHandler } from '../middleware/asyncHandler'
import { getUserById } from '../controllers/userController'
import { isAuthenticate } from '../middleware/isAuth'



const userServiceRouter = express.Router()

userServiceRouter.post("/register", asyncHandler(userRegistration))
userServiceRouter.post("/login", asyncHandler(userLogin))
userServiceRouter.post("/logout", asyncHandler(userLogout))
userServiceRouter.get("/getuserbyid", isAuthenticate,asyncHandler(getUserById))



export default userServiceRouter