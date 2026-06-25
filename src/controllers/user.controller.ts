import { Request,Response } from 'express';
import { findAllUsers as findAllUsersService} from '../services/user.service.js';

export async function findAllUsers(_req: Request,res: Response){
    const response = await findAllUsersService();
    res.json(response);
}