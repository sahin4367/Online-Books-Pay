import { Router } from "express";
import { authorController } from "./author.controller";

export const authorRouter = Router();
const controller = authorController;

authorRouter.post('/create' , controller.createAuthor)
authorRouter.get('/list' , controller.listAuthor)
authorRouter.get('/list/:id' , controller.listAuthorId)
authorRouter.put('/update/:id' , controller.updateAuthor)
authorRouter.delete('/delete/:id' , controller.deleteAuthor)
authorRouter.put('/delete/:id' , controller.softDeleteAuthor)






