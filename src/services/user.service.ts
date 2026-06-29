import { getAll,getById } from '../repositories/user.repository.js';
import { createUser } from '../repositories/user.repository.js';

export async function findAllUsers(){
    const users = await getAll();
    return users;
}
export async function findById(id: number) {
    const user = await getById(id);
    if(!user){
        throw new Error("User not found! ");
    }
    else return user;
}
export async function createUserService(data: {email: string, name: string}){
    const user = await createUser(data);
    if(!user){
        throw new Error("User not created! ");
    }
    else return user;
}