import { prisma } from "../config/database.js";
import { CreateAvailabiltyExceptioneDto, CreateAvailabiltyRuleDto, UpdateAvailabiltyExceptionDto, UpdateAvailabiltyRuleDto } from "../dtos/availability.dto.js";


export async function findRulesByUser(userId: number){
    const rule = await prisma.availabilityRule.findMany({
        where: {
            userId
        },
        orderBy: [
            {weekday: "asc"}, {startTime: "asc"},
        ]
    });
    return rule;
}

export async function findRulesById(id: number) {
    const rule = await prisma.availabilityRule.findUnique({
        where: {
            id
        }
    });
    return rule;
}

export async function createRule(userId: number,data: CreateAvailabiltyRuleDto) {
    const rule = await prisma.availabilityRule.create({
        data: {
            userId,
            ...data,
        }
    });
    return rule;
}

export async function updateRule(id: number, data:UpdateAvailabiltyRuleDto){
    const rule = await prisma.availabilityRule.update({
        where:{
            id,
        },
        data,
    });
    return rule;
}

export async function removeRule(id: number){
    await prisma.availabilityRule.delete({
        where: {
            id
        },
    });
}

export async function findExceptionsByUser(userId: number){
    const exception = await prisma.availabilityException.findMany({
        where: {
            userId,
        },
        orderBy: {
            date: "asc",
        },
    });
    return exception;
}

export async function findExceptionsById(id: number){
    const exception = await prisma.availabilityException.findUnique({
        where: {
            id,
        },
    });
    return exception;
}

export async function createException(userId: number, data: CreateAvailabiltyExceptioneDto){
    const { date, ...rest} = data;
    const exception = await prisma.availabilityException.create({
        data: {
            userId,
            ...rest,
            date: new Date(`${date}T00:00:00.000Z`),
        },
    });
    return exception;
}

export async function updateException(id: number, data: UpdateAvailabiltyExceptionDto){
    const {date, ...rest} = data;
    const exception = await prisma.availabilityException.update({
        where:{
            id,
        },
        data: {
            ...rest,
            ...(date != undefined && {date: new Date(`${date}T00:00:00.000Z`)}),
        },
    });
    return exception;
}

export async function removeException(id: number) {
    await prisma.availabilityException.delete({
        where: {
            id,
        },
    });
}

export async function findExceptionByUserInRange(
    userId: number,
    startDate: Date,
    endDate: Date
){
    const exception =  await prisma.availabilityException.findMany({
        where: {
            userId,
            date: {
                gte: startDate,
                lte: endDate,
            },
        },
        orderBy: {
            date: "asc",
        }
    });
    return exception;
}