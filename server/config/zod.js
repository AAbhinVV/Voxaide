import {z} from 'zod';

const registerSchema = z.object({
    username: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.email()("invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    phone_number: z.string().min(7, "Phone must be at least 7 digits")
})

const loginSchema = z.object({
    username: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.email()("invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
})

export {registerSchema, loginSchema}
