import { Request,Response,NextFunction } from "express";
import { Author } from "../../../DAL/models/author.model";
import { Book } from "../../../DAL/models/book.model";
import { AuthorDTO } from "./author.dto";
import { In } from "typeorm";
import { validate } from "class-validator";

interface UpdateAuthorDTO {
    name : string;
    bio : string;
}

const createAuthor = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
    try {
        const {name,bio,book_list_id} = req.body;
        if (!name || !bio || !book_list_id) {
            res.status(400).json({message : `Butun melumatlari daxil et!`});
            return;
        }

        const book_list = await Book.find({
            where : {
                id : In(req.body.book_list_id)
            }
        });

        if (book_list.length === 0) {
            res.status(400).json({message : `Book list empty!`});
            return;
        }

        const dto = new AuthorDTO();
        dto.name = name;
        dto.bio = bio;
        dto.book_list_id = book_list_id;

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
    };
    
        const author = new Author();
        author.name = name;
        author.bio = bio;
        author.books = book_list;

        const savedAuthor = await Author.save(author);
        res.status(201).json(savedAuthor);
    } catch (error) {
        next(error);
    }
}

const listAuthor = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
    try {
        const authors = await Author.find({
            relations : ["books"],
        })
        res.status(200).json(authors);
    } catch (error) {
        next(error);
    }
}

const listAuthorId = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
    try {
        const authorId = Number(req.params.id);
        const author = await Author.findOne({
            where : {id : authorId},
            relations : ["books"]
        })
        if (!author) {
            res.status(404).json({
                message : `Author not found!`
            })
            return;
        }
        res.status(200).json(author);
    } catch (error) {
        next(error);
    }
}

const updateAuthor = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
    try {
        const authorId = Number(req.params.id);
        const updateData : UpdateAuthorDTO = req.body;

        const author = await Author.findOne({
            where : {id : authorId}
        })
        if(!author) {
            res.status(404).json({
                message : `Author not found!`
            })
            return;
        }

        Object.assign(author, updateData);

        const updatedAuthor = await author.save();
        res.status(201).json({
            message : `Author saccessfully updated!`,
            author : {
                name : updatedAuthor.name,
                bio : updatedAuthor.bio,
            }
        })
    } catch (error) {
        next(error);
    }
}


const deleteAuthor = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
    try {
        const authorId = Number(req.params.id);
        const authorDate = await Author.findOne({
            where : {id : authorId},
            relations : ["books"],
        })
        if (!authorDate) {
            res.status(404).json({
                messagee : `Author not found!`
            })
            return;
        }
        await Author.delete(authorId);
        res.json({
            message : `Book whit id : ${authorId} delete saccessfully`
        })
    } catch (error) {
        next(error);
    }
}

const softDeleteAuthor = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
    try {
        const authorId = Number(req.params.id);
        const bookIds : number[] = req.body.book_ids || [];
        const authorData = await Author.findOne({
            where : {id : authorId},
            relations : ["books"]  
        })
        if (!authorData) {
            res.status(404).json({
                messagee : `Author not found!`
            })
            return;
        }

        await Author.update(authorId , {
            isdeleted : true,
            deleted_at : new Date(),
        });

//muellife aid butun kitablari silir : 
        if (authorData.books.length > 0) {
            const bookId = authorData.books.map(book => book.id);
            await Book.update(bookId , {
                isdeleted : true,
                deleted_at : new Date(),
            })
        }
        res.json({message : `Author saccessfully whith book deleted ! `})
    } catch (error) {
        next(error);
    }
}

//muellifin mueyyen id - li kitablari silmek : Biznes ! 
        // if (bookIds.length > 0) {
        //     const booksToDelete = authorData.books
        //         .filter(book => bookIds.includes(book.id))
        //         .map(book => book.id);

        //     if (booksToDelete.length > 0) {
        //         await Book.update(booksToDelete , {
        //             isdeleted : true,
        //             deleted_at : new Date(),
        //         })
        //     }
        // }

export const authorController = {
    createAuthor,
    listAuthor,
    listAuthorId,
    updateAuthor,
    deleteAuthor,
    softDeleteAuthor

}