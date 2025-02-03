import { User } from '../../DAL/models/user.model';

declare global {
    namespace Express {
        interface Request {
            user?: User; 
        }
    }
}
