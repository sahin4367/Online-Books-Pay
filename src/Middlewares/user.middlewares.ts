import { Request,Response,NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { appConfig } from '../consts';
import { User } from '../DAL/models/user.model';

interface JwtPayload {
    sub : number;
}

export const useAuth = async (req:Request,res:Response,next:NextFunction):Promise<void> => {
    console.log("useAuth middleware" , useAuth);
    
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
        res.status(401).json({
            message : `Token tapilmadi`
        })
        return;
    }

    const access_token = req.headers.authorization.split(" ")[1];
    if (!access_token) {
        res.status(401).json({
            message : `Token Tapilmadi!`
        })
        return;
    }

    try {
        const jwtResult = jwt.verify(access_token , appConfig.JWT_SECRET!) as unknown;
        const payload = jwtResult as JwtPayload;

        const user = await User.findOneBy({ id : parseInt(payload.sub.toString(), 10)});
        if (!user) {
            res.status(404).json({
                message : `User not found`
            })
            return;
        }

        (req as any).user = user;
        next();

    } catch (error : any) {
        res.status(500).json({
            message : error.message,
            error,
        })
    }
}