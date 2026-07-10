import { Router } from "express";
import { deleteUser, findAllUsers,findById, updateUser } from '../controllers/user.controller.js';
import { createUser } from '../controllers/user.controller.js';
import { createUserSchema, updateUserSchema } from "../dtos/user.dto.js";
import { validate } from "../middleware/validate.js";

export const userRouter: Router = Router();

userRouter.get('/',findAllUsers);
userRouter.get('/:id',findById);

userRouter.post('/',validate(createUserSchema) ,createUser);

userRouter.patch('/:id',validate(updateUserSchema), updateUser);

userRouter.delete('/:id',deleteUser);