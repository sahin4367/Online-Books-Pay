import { Request,Response,NextFunction } from "express";
import { Order } from "../../../DAL/models/order.model";
import { error } from "console";
import { payment } from "paypal-rest-sdk";
import paypal from "../../../DAL/config/paypal";
import { EPaymentStatus, Payment } from "../../../DAL/models/payment.model";

const createPayment = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
    try {
        const { orderId } = req.body;

        const order = await Order.findOne({ where: { id: orderId }, relations: ["users"] }); 
        if (!order) {
            res.status(404).json({ message: "Sifariş tapılmadı!" });
            return;
        }

        const paymentData = {
            intent: "sale",
            payer: {
            payment_method: "paypal",
            },
        redirect_urls: {
            return_url: "http://localhost:8000/api/payments/success",
            cancel_url: "http://localhost:8000/api/payments/cancel",
        },
        transactions: [
            {
                amount: {
                total: order.totalPrice.toFixed(2),
                currency: "USD",
            },
            description: `Payment for order #${order.id}`,
        },
        ],
    };

    paypal.payment.create(paymentData, async (error, payment) => {
        if (error) {
            console.error("PayPal is error : ",  error.response);
            res.status(500).json({ message: "Payment not created!" });
            return;
        }

        const newPayment = new Payment();
        newPayment.orders = order;
        newPayment.users = order.users;
        newPayment.status = EPaymentStatus.PENDING;
        newPayment.paymentId = payment.id!;

        await newPayment.save();

        const approvalUrl = payment.links?.find((link) => link.rel === "approval_url")?.href;
        res.json({ approvalUrl });
        return;
    });
    } catch (error) {
    next(error);
    }
};


const executePayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { paymentId, PayerID } = req.query;

        if (!paymentId || !PayerID) {
            res.status(400).json({ message: "Invalid payment details!" });
            return;
        }

        const execute_payment_json = {
            payer_id: PayerID as string,
        };

        paypal.payment.execute(paymentId as string, execute_payment_json, async (error, payment) => {
            if (error) {
                console.error(error);
                res.status(500).json({ message: "Payment execution failed!" });
                return;
            }

            // Ödəniş uğurlu olarsa, DB-də statusu yeniləmiyini unutma  ,
            const existingPayment = await Payment.findOne({ where: { paymentId: payment.id } });

            if (existingPayment) {
                existingPayment.status = EPaymentStatus.SUCCESS;
                await existingPayment.save();
            }

            res.json({ message: "Payment successful!", payment });
        });

    } catch (error) {
        next(error);
    }
};


export const paymentController = {
    createPayment,
    executePayment
}