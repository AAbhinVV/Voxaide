import {z} from 'zod';

const registerSchema = z.object({
    username: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    phone_number: z.string().min(7, "Phone must be at least 10 digits").optional()
})

const loginSchema = z.object({
    email: z.email("invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
})

const querySchema = z.object({query: z.string()})

export {registerSchema, loginSchema, querySchema}