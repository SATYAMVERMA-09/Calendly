import { Router } from "express";
import { findAllUsers,findById } from '../controllers/user.controller.js';
import { createUser } from '../controllers/user.controller.js';
import { createUserSchema } from "../dtos/user.dto.js";
import { validate } from "../middleware/validate.js";

export const userRouter: Router = Router();

userRouter.get('/',findAllUsers);
userRouter.get('/:id',findById);

userRouter.post('/',validate(createUserSchema) ,createUser);