import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.model";
import { Payment } from "./payment.model";


@Entity ({name : "users"})
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id : Number;

    @Column({type : "varchar" , length : 250})
    fullname : String;

    @Column({type : "varchar" , length : 250})
    email : String;

    @Column({type : "varchar" , length : 250})
    password : string;

    @Column({type : "boolean"})
    isVerifiedEmail : Boolean;

    @Column({type : "datetime" ,nullable :true})
    codeExpireAt : Date | null ;
    
    @Column({type : "int" , nullable: true})
    verifyCode : number | null;


    @OneToMany(() => Order , order => order.users)
    orders : Order[];

    @OneToMany(() => Payment , payment  => payment.users)
    payments : Payment[];
}