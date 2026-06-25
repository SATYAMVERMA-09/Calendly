import { Router } from "express";
import { findAllUsers } from '../controllers/user.controller.js';
import { findById } from "../controllers/user.controller.js";

export const userRouter: Router = Router();

userRouter.get('/',findAllUsers);
userRouter.get('/:id',findById);