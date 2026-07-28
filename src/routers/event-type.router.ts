import { Router } from "express";
import { requireUserId } from "../middleware/require-user-id.js";
import { create, getById, list, remove, update } from "../controllers/event-type.controller.js";
import { validate } from "../middleware/validate.js";
import { createEventTypeSchema, updateEventTypeSchema } from "../dtos/event-type.dto.js";

export const eventTypeRouter: Router = Router();

eventTypeRouter.use(requireUserId);

eventTypeRouter.get('/',list);
eventTypeRouter.get('/:id',getById);
eventTypeRouter.post('/',validate(createEventTypeSchema), create);
eventTypeRouter.patch('/:id',validate(updateEventTypeSchema), update);
eventTypeRouter.delete('/:id', remove);