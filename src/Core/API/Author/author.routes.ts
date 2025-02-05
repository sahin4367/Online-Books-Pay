import { Router } from "express";
import { authorController } from "./author.controller";
import { useAuth } from "../../../DAL/Middlewares/user.middlewares";
import { adminAuth } from "../../../DAL/Middlewares/admin.middlewares";

export const authorRouter = Router();
const controller = authorController;

authorRouter.post('/create' , useAuth , adminAuth, controller.createAuthor)
authorRouter.get('/list' , controller.listAuthor)
authorRouter.get('/list/:id' , controller.listAuthorId)
authorRouter.put('/update/:id' , useAuth , adminAuth , controller.updateAuthor)
authorRouter.delete('/delete/:id' , useAuth , adminAuth , controller.deleteAuthor)
authorRouter.put('/delete/:id' , useAuth , adminAuth , controller.softDeleteAuthor)






