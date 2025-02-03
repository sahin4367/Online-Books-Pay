import { IsEnum, IsNumber } from "class-validator";
import { ESatus } from "../../../DAL/models/order.model";

export class CreateOrderDTO {
    @IsNumber()
    quantity : number;

    @IsNumber()
    totalPrice : number;

    @IsEnum(ESatus)
    status : ESatus;

}