import { Router } from "express";
import { paymentController } from "./payment.controller";

export const paymentRouter = Router();
const controller = paymentController;

paymentRouter.post('/payment' , controller.createPayment)
paymentRouter.get('/success' , controller.executePayment)

