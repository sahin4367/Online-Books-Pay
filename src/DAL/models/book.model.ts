import { BaseEntity, Column, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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

    @ManyToMany(() => Order)
    @JoinTable({
        name : "books_orders",
        joinColumn : {name : "books_id"},
        inverseJoinColumn : {name : "orders_id"}
    })
    orders : Order[];
}
