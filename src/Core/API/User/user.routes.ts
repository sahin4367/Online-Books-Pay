import { Router } from "express";
import { userController } from "./user.controller";
import { useAuth } from "../../../Middlewares/user.middlewares";

export const userRouter = Router();
const controller = userController;

userRouter.post('/register', controller.register)
userRouter.post('/login', controller.login)
userRouter.post('/verify/email' , useAuth, controller.verifyEmail)
userRouter.post('/verify/email/check' , useAuth, controller.checkEmailCode)
