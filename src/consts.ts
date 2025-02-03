// import paypal from "paypal-rest-sdk";

import 'dotenv/config'

export const appConfig = {
    PORT: process.env.PORT, 
    USER_EMAIL: process.env.USER_EMAIL,
    PASSWORD: process.env.PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET,
    verifyCodeExpiteMinute : 10,

    Host: process.env.DB_HOST,
    Port: Number(process.env.DB_PORT),
    Username: process.env.DB_USER,
    Password: process.env.DB_PASSWORD,
    Database: process.env.DB_NAME,
};


// export const paypalConfig = {
//     mode : process.env.PAYPAL_MODE || "sandbox",
//     client_id : process.env.PAYPAL_CLIENT_ID!,
//     client_secret : process.env.PAYPAL_SECRET_KEY!,
// }