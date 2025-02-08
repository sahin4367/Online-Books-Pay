import express, { Request, Response, NextFunction } from "express";
import "reflect-metadata"
import cors from 'cors';
import * as dotenv from 'dotenv';
import { v1Router } from "./routes";
import { AppDataSource } from "./DAL/config/data-source";
import { appConfig } from "./consts";

dotenv.config();
AppDataSource.initialize()
    .then((): void => {
        console.log("Database connected successfully!");        
    })
    .catch((error: Error): void => {
        console.error("Not connected to database", error);
    })

const app = express();
app.use(cors())
app.use(express.json());


app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    res.status(500).json({ error });
    });

app.use('/api/v1' , v1Router)


const Port = appConfig.PORT;
app.listen(Port , () => {
    console.log(`Server is running on port - ${Port}`);
    })
