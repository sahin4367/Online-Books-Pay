import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.model";
import { Book } from "./book.model";
import { Payment } from "./payment.model";

export enum ESatus {
    PENDING = "PENDING",
    PAID = "PAID",
    CANCELLED = "CANCELLED"
}
@Entity({name : "orders"})
export class Order extends BaseEntity {
    @PrimaryGeneratedColumn()
    id : number;

    @Column({type : "int"})
    quantity : number;

    @Column({type : "int"})
    totalPrice : number;

    @Column({type : "enum" , enum : ESatus , default : ESatus.PENDING})
    status : ESatus;

    @ManyToOne(() => User , user => user.orders , {onDelete : "CASCADE"})
    @JoinColumn({name : "user_id"})
    users : User;

    @ManyToOne(() => Book , book => book.orders , {onDelete: "CASCADE"})
    @JoinColumn({name : "book_id"})
    books : Book

    @OneToMany(() => Payment , payment => payment.orders)
    payments : Payment[];
}

