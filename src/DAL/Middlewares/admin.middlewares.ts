import { Response, NextFunction } from "express";
import { UserRole } from "../models/user.model";
import { CustomRequest } from "../../types/custome-requst";

export const adminAuth = async (req: CustomRequest, res: Response, next: NextFunction):Promise<void> => {
    if (!req.user) {
        res.status(401).json({
            message : `Login is required~!`
        });
        return;
    }

    if (req.user.role !== UserRole.ADMIN) {
        res.status(403).json({
            message : `You don't have permission~!`
        });
        return;
    }

    next();
};
