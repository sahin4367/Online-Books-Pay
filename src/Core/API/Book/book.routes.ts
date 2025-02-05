import { Router } from "express";
import { bookController } from "./book.controller";
import { adminAuth } from "../../../DAL/Middlewares/admin.middlewares";
import { useAuth } from "../../../DAL/Middlewares/user.middlewares";

export const bookRouter = Router();
const controller = bookController;

bookRouter.post('/create' , useAuth, adminAuth , controller.createBook)
bookRouter.get('/list' , controller.listBook)
bookRouter.get('/list/:id' , controller.listBookId)
bookRouter.put('/update/:id' , useAuth ,adminAuth,  controller.updateBook)
bookRouter.delete('/delete/:id' , useAuth , adminAuth ,controller.deleteBook)
bookRouter.put('/delete/:id' , useAuth , adminAuth , controller.softDeleteBook)


