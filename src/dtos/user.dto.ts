import { z } from 'zod';

export const createUserSchema = z.object({
    email: z.email('Invalid email address'),
    name: z.string().min(1,'Name is required').max(100,'Name must be less than 100 characters'),
})

export type CreateUserDto = z.infer<typeof createUserSchema>;