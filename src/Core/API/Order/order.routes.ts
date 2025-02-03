import { Router } from "express";
import { orderController } from "./order.controller";

export const orderRouter = Router();
const controller = orderController;

orderRouter.post('/newOrder', controller.createOrder)
