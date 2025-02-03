import { Router } from "express";
import { userRouter } from "../Core/API/User/user.routes";
import { authorRouter } from "../Core/API/Author/author.routes";
import { bookRouter } from "../Core/API/Book/book.routes";
import { orderRouter } from "../Core/API/Order/order.routes";
import { paymentRouter } from "../Core/API/Payment/payment.routes";

export const v1Router = Router();

v1Router.use('/users' , userRouter)
v1Router.use('/authors', authorRouter)
v1Router.use('/books' , bookRouter)
v1Router.use('/orders' , orderRouter)
v1Router.use('/payments', paymentRouter)
