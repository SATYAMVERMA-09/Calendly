import { CreateUserDto } from '../dtos/user.dto.js';
import { findByEmail, getAll,getById } from '../repositories/user.repository.js';
import { createUser } from '../repositories/user.repository.js';
import { badRequest, conflict, notFound } from '../utils/api-error.js';

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
export async function createUserService(data: CreateUserDto){
    const existingUser = await findByEmail(data.email);
    if(existingUser) {
        throw conflict('User already exists');
    }

    return createUser(data);
}