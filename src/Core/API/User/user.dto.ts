import { IsEmail, IsString, Length } from "class-validator";

export class RegisterDTO {
    @IsString()
    @Length(3,15)
    fullname : string;

    @IsEmail()
    email : string;

    @IsString()
    @Length(6,15)
    password : string;
}