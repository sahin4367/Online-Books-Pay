import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { appConfig } from '../../consts';
import { User } from '../models/user.model';
import { CustomRequest } from '../../types/custome-requst';

interface JwtPayload {
    sub : number;
}

export const useAuth = async (req:CustomRequest,res:Response,next:NextFunction):Promise<void> => {
    console.log("useAuth middleware" , useAuth);
    
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
        res.status(401).json({
            message : `Token not found!`
        })
        return;
    }

    const access_token = req.headers.authorization.split(" ")[1];
    if (!access_token) {
        res.status(401).json({
            message : `Token not found!`
        })
        return;
    }

    try {
        const jwtResult = jwt.verify(access_token , appConfig.JWT_SECRET!) as unknown;
        const payload = jwtResult as JwtPayload;

        const user = await User.findOneBy({ id : parseInt(payload.sub.toString(), 10)});
        if (!user) {
            res.status(404).json({
                message : `User not found~!`
            })
            return;
        }

        req.user = user;
        next();

    } catch (error : any) {
        res.status(500).json({
            message : error.message,
            error,
        })
    }
}