import { Router } from "express";
import { orderController } from "./order.controller";
import { useAuth } from "../../../DAL/Middlewares/user.middlewares";
import { adminAuth } from "../../../DAL/Middlewares/admin.middlewares";

export const orderRouter = Router();
const controller = orderController;

orderRouter.post('/newOrder', useAuth, adminAuth , controller.createOrder)
