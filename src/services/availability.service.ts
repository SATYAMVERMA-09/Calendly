import {
    CreateAvailabiltyExceptioneDto,
    CreateAvailabiltyRuleDto,
    UpdateAvailabiltyExceptionDto,
    UpdateAvailabiltyRuleDto,
} from "../dtos/availability.dto.js";
import {
    createException as createExceptionInRepo,
    createRule as createRuleInRepo,
    findExceptionsById,
    findExceptionsByUser,
    findRulesById,
    findRulesByUser,
    removeException as removeExceptionInRepo,
    removeRule as removeRuleInRepo,
    updateException as updateExceptionInRepo,
    updateRule as updateRuleInRepo,
} from "../repositories/availability.repository.js";
import { forbidden, notFound } from "../utils/api-error.js";

export async function listRules(userId: number) {
    const rules = await findRulesByUser(userId);
    return rules;
}

export async function createRule(userId: number, data: CreateAvailabiltyRuleDto) {
    return createRuleInRepo(userId, data);
}

export async function updateRule(userId: number, ruleId: number, data: UpdateAvailabiltyRuleDto) {
    const rule = await findRulesById(ruleId);
    if (!rule) {
        throw notFound("Availability rule not found");
    }
    if (rule.userId !== userId) {
        throw forbidden("You are not authorized to update this availability rule");
    }
    return updateRuleInRepo(ruleId, data);
}

export async function removeRule(userId: number, ruleId: number) {
    const rule = await findRulesById(ruleId);
    if (!rule) {
        throw notFound("Availability rule not found");
    }
    if (rule.userId !== userId) {
        throw forbidden("You are not authorized to delete this availability rule");
    }
    return removeRuleInRepo(ruleId);
}

export async function listExceptions(userId: number) {
    return findExceptionsByUser(userId);
}

export async function createException(userId: number, data: CreateAvailabiltyExceptioneDto) {
    return createExceptionInRepo(userId, data);
}

export async function updateException(userId: number, exceptionId: number, data: UpdateAvailabiltyExceptionDto) {
    const exception = await findExceptionsById(exceptionId);
    if (!exception) {
        throw notFound("Availability exception not found");
    }
    if (exception.userId !== userId) {
        throw forbidden("You are not authorized to update this availability exception");
    }
    return updateExceptionInRepo(exceptionId, data);
}

export async function removeException(userId: number, exceptionId: number) {
    const exception = await findExceptionsById(exceptionId);
    if (!exception) {
        throw notFound("Availability exception not found");
    }
    if (exception.userId !== userId) {
        throw forbidden("You are not authorized to delete this availability exception");
    }
    return removeExceptionInRepo(exceptionId);
}
