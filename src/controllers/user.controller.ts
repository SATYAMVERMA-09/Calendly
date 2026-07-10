import { Request,Response } from 'express';
import { findAllUsers as findAllUsersService,findById as findByIdService} from '../services/user.service.js';
import { createUser as createUserService,updateUser as updateUserService,deleteUser as deleteUserService} from '../services/user.service.js';
import { sendSuccess } from '../utils/api-response.js';

export async function findAllUsers(_req: Request,res: Response){
    const response = await findAllUsersService();
    sendSuccess(res, response);
}
export async function findById(req: Request, res:Response){
    const { id } = req.params;
    const response = await findByIdService(Number(id));
    sendSuccess(res, response);
}
export async function createUser(req: Request, res: Response){
    const newUser = await createUserService(req.body);
    sendSuccess(res, newUser, 201);
}
export async function updateUser(req: Request, res: Response){
    const { id } = req.params;
    const updatedUser = await updateUserService(Number(id), req.body);
    sendSuccess(res, updatedUser, 200, "User updated successfully");
}

export async function deleteUser(req: Request, res: Response){
    const { id } = req.params;
    const deleteUser = await deleteUserService(Number(id));
    sendSuccess(res, deleteUser, 200, "User deleted successfully");
}