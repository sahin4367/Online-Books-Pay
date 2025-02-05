import { Request, Response, NextFunction } from "express";
import { User, UserRole } from "../models/user.model";

export const adminAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = (req as any).user as User; 
    if (!user) {
        res.status(401).json({ message: "Login required!" });
        return;
    }

    if (user.role !== UserRole.ADMIN) {
        res.status(403).json({ message: "You don't have permission!" });
        return;
    }

    next();
};
