import { BaseEntity, Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Author } from "./author.model";
import { Order } from "./order.model";


@Entity({name : "books"})
export class Book extends BaseEntity {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    title : string;

    @Column()
    price : number;

    @Column()
    stock : number;

    @Column()
    soldCount : number;

    @Column({default : false})
    isdeleted : boolean;

    @DeleteDateColumn({type : "datetime" , nullable : true})
    deleted_at : Date;

    @ManyToOne(() => Author, (author) => author.books , {onDelete: "CASCADE"})
    @JoinColumn({name : "author_id"})
    authors : Author;

    @OneToMany(() => Order , order => order.books)
    orders : Order[];
}
