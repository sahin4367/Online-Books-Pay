import { IsArray, IsNumber, IsString, Length } from "class-validator";


export class AuthorDTO {
    @IsString()
    @Length(3,15)
    name : string;

    @IsString()
    @Length(10,100)
    bio : string;

    @IsArray()
    book_list_id : number[];
}