import { BaseEntity, Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Book } from "./book.model";

@Entity({name : "authors"})
export class Author extends BaseEntity {
    @PrimaryGeneratedColumn()
    id : number;

    @Column({type : "varchar" , length : 150})
    name : string;

    @Column({type : "varchar" , length : 250})
    bio : string;

    @Column({default : false})
    isdeleted : boolean;
    
    @DeleteDateColumn({type : "datetime" , nullable : true})
    deleted_at : Date;

    @OneToMany(() => Book, (book) => book.authors)
    books : Book[];
}