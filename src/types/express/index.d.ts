import { User } from "../../DAL/models/user.model";

declare module "express" {
    export interface Request {
        user?: User;
    }
}

