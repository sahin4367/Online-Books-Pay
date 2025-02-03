import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.model";
import { Order } from "./order.model";

export enum EPaymentStatus {
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED"
}
@Entity({name : "payments"})
export class Payment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id : number;

    @Column({type: "enum" , enum : EPaymentStatus , default : EPaymentStatus.PENDING})
    status : EPaymentStatus;

    @Column({type : "varchar" , nullable : true})
    paymentId : string; //PayPal terefinden yaradilan Payment Id -si ;

    @Column({type : "varchar" , nullable : true})
    payerId : string; //odenisi eden istifadecinin PayPal id -si ;

    @Column({type : "decimal" }) // precision: 10, scale: 2
    amount : number;

    @Column({type:"datetime" , nullable : true})
    created_at : Date;

    @ManyToOne(() => User , user => user.payments, {onDelete : "CASCADE"})
    @JoinColumn({name : "userId"})
    users : User;

    @ManyToOne(() => Order , order => order.payments , {onDelete : "CASCADE"})
    @JoinColumn({name : "orderId"})
    orders : Order;
    
}