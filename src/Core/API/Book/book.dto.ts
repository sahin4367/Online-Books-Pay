import { IsNumber, IsString, Length } from "class-validator";

export class BookDTO {
    @IsString()
    @Length(3,100)
    title : string;

    @IsNumber()
    price : number;

    @IsNumber()
    stock : number;

    @IsNumber()
    soldCount : number;

    @IsNumber()
    orders_list_id : number;
}