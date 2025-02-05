import { Request,Response,NextFunction } from "express";
import { RegisterDTO } from "./user.dto";
import { User } from "../../../DAL/models/user.model";
import bcrypt from 'bcrypt';
import moment from "moment";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { appConfig } from "../../../consts";
import { validate } from "class-validator";
import { CustomRequest } from "../../../types/custome-requst";

const transporter = nodemailer.createTransport({
    service : "Gmail",
    host : "smtp.gmail.com",
    port : 587,
    secure : false,
    auth : {
        user : appConfig.USER_EMAIL,
        pass : appConfig.PASSWORD,
    }
})

const register = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
    try {
        const {fullname,email,password} = req.body;

        const dto = new RegisterDTO();
        dto.fullname = fullname;
        dto.email = email;
        dto.password = password;

        const errors = await validate(dto);
        if (errors.length > 0) {
            const formattedErrors = errors.reduce((acc,error) => {
                acc[error.property] = Object.values(error.constraints || {});
                return acc;
            },{} as { [key: string]: string[] })
            res.status(400).json({
                message: "Validation failed",
                errors: formattedErrors,
            });
            return;
        }

        const existingUser = await User.findOne({
            where : {email}
        })
        if (existingUser)  {
            res.status(409).json({
                message : `This email is already registered`
            })
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User();
        newUser.fullname = fullname;
        newUser.email = email;
        newUser.password = hashedPassword;

        const savedUser = await newUser.save();

        //JWT yaratmaq:
        res.status(201).json({
            message : "User registered saccessfully!",
            user : {
                id : savedUser.id,
                email : savedUser.email,
                fullname : savedUser.fullname,
            }
        })
        
    } catch (error : any) {
        res.status(500).json({
            message : `An error occurred!`,
            error : error.message,
        })
    }
}

const login = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
    try {
        const {email,password} = req.body;
        if (!email || !password) {
            res.status(400).json({
                message : `Please fill in all required fields.`
            })
            return;
        }
        const user = await User.findOne({
            where : {email}
        })
        if (!user) {
            res.status(404).json({
                message : `User not found!`
            })
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({
                message : `Invalid password!`
            })
            return;
        }
        // token yaradaq
        const token = jwt.sign(
            {sub : user.id},
            appConfig.JWT_SECRET!,
            {expiresIn : "1d"},
        )
        res.status(201).json({
            message : `Login Saccessfully!`,
            token,
        })
    } catch (error:any) {
        res.status(500).json({
            message : `An error occured!`,
            error: error.message,
        })
    }
}

const verifyEmail = async(req:CustomRequest,res:Response,next:NextFunction):Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                message : `Unauthorized!`,
            })
            return;
        }

        const user = req.user;

        if (user.isVerifiedEmail) {
            res.json({
                message : `Alreade  email verifications!`
            })
            return;
        }
        //create random code :
        const randomCode: number = Math.floor(100000 + Math.random() * 999999);
        const codeExpireAt = moment().add(appConfig.verifyCodeExpiteMinute , "minutes").toDate();

        user.codeExpireAt = codeExpireAt;
        user.verifyCode = randomCode;
        await user.save();

        const mailOptions = {
            from : appConfig.USER_EMAIL,
            to : req.user.email.toString(),
            subject : "Email verificartion!",
            text : `Your verification code - ${randomCode}`,
        }
        transporter.sendMail(mailOptions , (error,info) => {
            if (error) {
                res.status(500).json({message : error.message , error})
            } else {
                return res.json({
                    message : `Verification code sent to your email. 
                    It will expire in ${appConfig.verifyCodeExpiteMinute} minutes.`
                });
            }
        })
    } catch (error:any) {
        res.status(500).json({
            message : `An error occured!`,
            error : error.message,
        })
    }
}

const checkEmailCode = async(req:CustomRequest,res:Response,next:NextFunction):Promise<void> => {
    try {
        if(!req.user) {
            res.status(401).json({ message : `Unauthorized`});
            return;
        }
        const user = req.user;
        const {code } = req.body;

        if (!code) {
            res.status(400).json({message : `Verification code is required !`});
            return;
        }
        if (user.isVerifiedEmail) {
            res.json({
                message : `Email is already veriified!`,
            });
            return;
        }
        if (user.codeExpireAt === null || user.codeExpireAt < new Date()) {
            res.status(400).json({
                message: "The verification code has expired or is invalid.",
            });
            return;
        }
        if (user.codeExpireAt === null || user.codeExpireAt < new Date()) {
            res.status(400).json({
                message: "The verification code has expired or is invalid.",
            });
            return;
        }
        
        if (user.verifyCode === code && user.codeExpireAt > new Date()) {
            user.isVerifiedEmail = true;
            user.verifyCode = null;
            user.codeExpireAt = null;


            await user.save();
            res.json({message : `Email verification saccessfuly! `});
        } else {
            res.status(400).json({
                message: "Invalid or expired verification code.",
            });
        }

    } catch (error:any) {
        res.status(500).json({
            message : `An error occurred while verifying the code.`,
            error : error.message,
        });  
    }
}

const allUser = async(req:CustomRequest,res:Response,next:NextFunction):Promise<void> => {
    try {
        const users = await User.find({
            relations : ["orders","payments"],
        })
        res.status(201).json(users);
    } catch (error) {
        next(error);
    }
}


export const userController = {
    register,
    login,
    verifyEmail,
    checkEmailCode,
    allUser,
}