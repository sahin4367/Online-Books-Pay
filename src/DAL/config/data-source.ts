import 'dotenv/config';
import { DataSource } from "typeorm";
import { appConfig } from '../../consts';
import { User } from '../models/user.model';
import { Book } from '../models/book.model';
import { Author } from '../models/author.model';
import { Order } from '../models/order.model';
import { Payment } from '../models/payment.model';


export const AppDataSource = new DataSource({
    type: "mysql",
    host: appConfig.Host,
    port: appConfig.Port,
    username: appConfig.Username,
    password: appConfig.Password,
    database: appConfig.Database,
    synchronize: true, //false
    logging: false, 
    entities: [User,Book,Author,Order,Payment], 
})
