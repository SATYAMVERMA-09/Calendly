import { getAll,getById } from '../repositories/user.repository.js';
import { createUser } from '../repositories/user.repository.js';
import { badRequest, notFound } from '../utils/api-error.js';

export async function findAllUsers(){
    const users = await getAll();
    return users;
}
export async function findById(id: number) {
    const user = await getById(id);
    if(!user){
        throw notFound("User not found!");
    }
    else return user;
}
export async function createUserService(data: {email: string, name: string}){
    const user = await createUser(data);
    if(!user){
        throw badRequest("User not created! ");
    }
    else return user;
}