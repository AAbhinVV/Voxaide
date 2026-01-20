import { z } from "zod";

const loginSchema = z.object({
    email: z.email("Invalid email format").min(1, "Please enter an email"),
    password: z.string().regex(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/g).min(1, "Please enter a password"),
})

export { loginSchema };

