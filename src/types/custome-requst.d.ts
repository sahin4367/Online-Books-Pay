import { Request } from "express";
import { User } from "../DAL/models/user.model"; 

export interface CustomRequest extends Request {
    user?: User; 
};

