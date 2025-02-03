import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { EPaymentStatus } from "../../../DAL/models/payment.model";


export class PaymentDTO {
    @IsNotEmpty()
    @IsInt()
    userId: number;

    @IsNotEmpty()
    @IsInt()
    orderId: number;

    @IsNotEmpty()
    @IsEnum(EPaymentStatus)
    status: EPaymentStatus;
}
