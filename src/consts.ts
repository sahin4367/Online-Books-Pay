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

