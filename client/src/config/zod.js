import { z } from "zod";

const loginSchema = z.object({
    email: z.email("Invalid email format").min(1, "Please enter an email"),
    password: z.string().regex(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/g).min(1, "Please enter a password"),
})

const signUpSchema = z.object({
    email: z.email("Invalid email format").min(1, "Please enter an email"),
    password: z.string().regex(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/g).min(1, "Please enter a password"),
    username: z.string().min(4, "Username must be at least 4 characters long").max(20, "Username must be at most 20 characters long"),
})

export { loginSchema, signUpSchema };
