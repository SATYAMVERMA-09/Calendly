import { prisma } from '../config/database.js';

export async function getAll() {
    const users = await prisma.user.findMany();
    return users;
}
export async function getById(id: number) {
    const user = await prisma.user.findUnique({
        where: {
            id // or id:id 
        }
    });
    return user;
}

export async function createUser(data: {email: string, name: string}){
    const user = await prisma.user.create({
        data: {
            email: data.email,
            name: data.name
        }
    });
    return user;
}