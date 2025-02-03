import { Router } from "express";
import { bookController } from "./book.controller";

export const bookRouter = Router();
const controller = bookController;

bookRouter.post('/create' , controller.createBook)
bookRouter.get('/list' , controller.listBook)
bookRouter.get('/list/:id' , controller.listBookId)
bookRouter.put('/update/:id' , controller.updateBook)
bookRouter.delete('/delete/:id' , controller.deleteBook)
bookRouter.put('/delete/:id' , controller.softDeleteBook)


