import { Router } from "express";
import { paymentController } from "./payment.controller";
import { useAuth } from "../../../DAL/Middlewares/user.middlewares";

export const paymentRouter = Router();
const controller = paymentController;

paymentRouter.post('/payment' , useAuth, controller.createPayment)
paymentRouter.get('/success' , controller.executePayment)

