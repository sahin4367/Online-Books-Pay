import { Request,Response,NextFunction } from "express";
import { BookDTO } from "./book.dto";
import { Book } from "../../../DAL/models/book.model";
import { title } from "process";
import { Order } from "../../../DAL/models/order.model";
import { In } from "typeorm";
import { validate } from "class-validator";

interface UpdateBookDTO {
    title  : string;
    price : number;
    stock : number;
    soldCount : number;
}

const createBook = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
    try {
        const {title,price,stock,soldCount} = req.body;
        if (!title || !price || !stock ||!soldCount) {
            res.status(400).json({message : `Enter is all the infomation~!`});
            return;
        }
        const dto = new BookDTO();
        dto.title = title;
        dto.price = price;
        dto.stock = stock;
        dto.soldCount = soldCount;

        const errors = await validate(dto);
        if (errors.length > 0) {
            const formattedErrors: Record<string, string[]> = {};
            errors.forEach(err => {
                formattedErrors[err.property] = Object.keys(err.constraints || {});
            });

            res.status(400).json({
                message: "Please enter correct information~!",
                errors: formattedErrors
            });
            return;
        }

        const book = new Book();
        book.title = dto.title;
        book.price = dto.price;
        book.stock = dto.stock;
        book.soldCount = dto.soldCount;

        const savedBook = await Book.save(book);
        res.status(201).json(savedBook);
    } catch (error) {
        next(error);
    }
}

const listBook = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
    try {
        const books = await Book.find({
            relations : ["orders"]
        });
        res.status(200).json(books);
    } catch (error) {
        next(error);
    }
}

const listBookId = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
    try {
        const bookId = Number(req.params.id);
        const book = await Book.findOne({
            where : {id : bookId},
            relations : ["orders"]
        })
        if (!book) {
            res.status(404).json({
                message : `Book not found~!`
            })
            return;
        }
        res.status(200).json(book);
    } catch (error) {
        next(error);
    }
}


const updateBook = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
    try {
        const bookId = Number(req.params.id);
        const updateData : UpdateBookDTO = req.body;

        const book = await Book.findOne({
            where : {id : bookId}
        })

        if (!book) {
            res.status(404).json({
                message : `Book not found~!`,
            })
            return;
        }

        Object.assign(book,updateData);

        const updatedBook = await book.save();
        res.status(200).json({
            message: `Book successfully updated~!`,
            book: {
                title: updatedBook.title,
                price: updatedBook.price,
                stock: updatedBook.stock,
                soldCount: updatedBook.soldCount,
            }
        });

    } catch (error) {
        next(error);
    }
}

//hard delete:
const deleteBook = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
    try {
        const bookId = Number(req.params.id);
        const bookData = await Book.findOne({
            where : {id : bookId},
        })
        if(!bookData) {
            res.status(404).json({
                message : `Book not found~!`
            })
            return;
        }
        await Book.delete(bookId);
        res.json({
            message : `Book whit id : ${bookId} delete saccessfully~!`
        })
    } catch (error) {
        next(error)
    }
}

// soft delete:
const softDeleteBook = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
    try {
        const bookId = Number(req.params.id);
        const bookData = await Book.findOne({
            where : {id : bookId}
        })
        if (!bookData) {
            res.status(404).json({
                message : `Book not found~!`,
            })
            return;
        }
        const deletedBook = await Book.update(bookId, {
            isdeleted : true,
            deleted_at : new Date()
        })
        res.json({message : `Book saccessfully deleted~! `})
    } catch (error) {
        next(error)
    }
}

export const bookController = {
    createBook,
    listBook,
    listBookId,
    updateBook,
    deleteBook,
    softDeleteBook,
}