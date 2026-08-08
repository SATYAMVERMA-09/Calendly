import { SLOT_GENERATION_DAYS } from "../config/env.js";
import { findActiveRulesByUser, findExceptionByUserInRange} from "../repositories/availability.repository.js";
import { findActiveEventTypesByHost } from "../repositories/event-type.repository.js";
import { findBookedSlotsByHostInRange } from "../repositories/slot.repository.js";
import { getById as getUserById } from "../repositories/user.repository.js";
import { DateTime } from "luxon";
import { applyExceptionForDate, overlapsBooked, splitIntoSlots, TimeWindow, windowsForWeekdayRule } from "./slot-generation.service.js";
import { prisma } from "../config/database.js";

export interface RegenerateHostSlotsInput {
    hostId: number;
    from?: string;
    to?: string;
}
export async function regenerateHostSlots(input: RegenerateHostSlotsInput) {
    const host = await getUserById(input.hostId);
    if(!host)return;

    const from = input.from
    ? DateTime.fromISO(input.from, { zone: "utc" }).startOf("day")
    : DateTime.now().startOf("day").toUTC();
    
    const to = input.to
    ? DateTime.fromISO(input.to, { zone: "utc" }).endOf("day")
    : from.plus({ days: SLOT_GENERATION_DAYS }).toUTC().endOf("day");

    const [rules, exceptions, eventTypes, bookedSlots] = await Promise.all([
        findActiveRulesByUser(host.id),
        findExceptionByUserInRange(host.id, from.toJSDate(), to.toJSDate()),
        findActiveEventTypesByHost(host.id),
        findBookedSlotsByHostInRange(host.id, from.toJSDate(), to.toJSDate())
    ]);

    const bookedWindows: TimeWindow[] = bookedSlots.map( (slot) => {
        return {
            start: DateTime.fromJSDate(slot.startAt, { zone: "utc" }),
            end: DateTime.fromJSDate(slot.endAt, { zone: "utc" }),
        }
    });

    for(const eventType of eventTypes){
        const generatedValidSlotKeys = new Set<string>();
        for(let cursor =from; cursor<=to;cursor = cursor.plus({days: 1})){
            const dateKey = cursor.toISODate();

            const dayExceptions = exceptions.filter((ex) => DateTime.fromJSDate(ex.date, {zone: 'utc'}).toISODate() === dateKey);
            const dayExceptionsWithTimeZone = dayExceptions.map((ex) => ({
                type: ex.type,
                startTime: ex.startTime,
                endTime: ex.endTime,
                timeZone: ex.timezone,
            }));

            let windows: TimeWindow[] = [];

            // convert rules into time windows -> compatible with luxon
            for(const rule of rules){
                windows.push(...windowsForWeekdayRule(cursor,rule.weekday,rule.startTime,rule.endTime,rule.timezone));
            }
            windows = applyExceptionForDate(cursor,windows,dayExceptionsWithTimeZone);

            const slots = splitIntoSlots(
                windows,
                eventType.durationMinutes,
                eventType.bufferBeforeMinutes,
                eventType.bufferAfterMinutes,
            ).filter(
                (slot) => slot.start > DateTime.utc() && !overlapsBooked(slot,bookedWindows,eventType.bufferBeforeMinutes,eventType.bufferAfterMinutes)
            ); // slots filtered to exclude past slots and slots that overlap with booked slots

            for(const slot of slots){
                const startAt = slot.start.toUTC().toJSDate();
                const endAt = slot.end.toUTC().toJSDate();

                const key = `${eventType.id}|${startAt.toISOString()}|${endAt.toISOString()}`;

                generatedValidSlotKeys.add(key);

                await prisma.slot.upsert({
                    where:{
                        eventTypeId_startAt_endAt: {
                            eventTypeId: eventType.id,
                            startAt,
                            endAt,
                        }
                    },
                    create: {
                        hostId: input.hostId,
                        eventTypeId: eventType.id,
                        startAt,
                        endAt,
                        status: 'AVAILABLE'
                    },
                    update: {
                        status: 'AVAILABLE',
                    }
                });
            }
        }

        const futureSlots = await prisma.slot.findMany({
            where: {
                eventTypeId: eventType.id,
                startAt: { gte: from.toJSDate(), lte: to.toJSDate()},
                status: { in : ['AVAILABLE','BLOCKED']},
            }
        });
        for(const slot of futureSlots) {
            const key = `${eventType.id}|${slot.startAt.toISOString()}|${slot.endAt.toISOString()}`;

            if(!generatedValidSlotKeys.has(key)){
                await prisma.slot.update({
                    where: {
                        id: slot.id,
                    },
                    data: {
                        status: 'BLOCKED',
                    }
                })
            }
        }
    }

} 