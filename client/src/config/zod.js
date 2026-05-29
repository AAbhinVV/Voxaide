import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email("Invalid email format").min(1, "Please enter an email"),
    password: z.string().regex(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/g, "Password must be at least 8 characters, contain a number, an uppercase letter, and a special character").min(1, "Please enter a password"),
})

const signUpSchema = z.object({
    email: z.string().email("Invalid email format").min(1, "Please enter an email"),
    password: z.string().regex(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/g, "Password must be at least 8 characters, contain a number, an uppercase letter, and a special character").min(1, "Please enter a password"),
    displayName: z.string().min(4, "Username must be at least 4 characters long").max(20, "Username must be at most 20 characters long"),
    confirmPassword: z.string().min(1, "Please confirm your password")
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match"
})

export { loginSchema, signUpSchema };
