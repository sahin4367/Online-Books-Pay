import { Request,Response,NextFunction } from "express";
import { Book } from "../../../DAL/models/book.model";
import { ESatus, Order } from "../../../DAL/models/order.model";
import { User } from "../../../DAL/models/user.model";


const createOrder = async (req:Request,res:Response,next : NextFunction):Promise<void> => {
    try {
        const {user_id,book_id,quantity} = req.body;

        const user = await User.findOne({
            where : {id: user_id}
        })
        const book = await Book.findOne({
            where : {id : book_id}
        })

        if (!user || !book) {
            res.status(404).json({
                message : `User and Book not found!`
            })
            return;
        }
        
        if (book.stock < quantity) {
            res.status(400).json({
                message : `Stock da kifayet qeder  kitab yoxdur!`
            });
            return;
        }


        const totalPrice = book.price * quantity;

        const order = new Order();
        order.users = user;
        order.quantity = quantity;
        order.totalPrice = totalPrice;
        order.status = ESatus.PENDING;

        await order.save();

        book.stock -= quantity;
        await book.save();

        res.status(201).json(order)        
    } catch (error) {
        next(error);
    }
}

export const orderController = {
    createOrder,
}