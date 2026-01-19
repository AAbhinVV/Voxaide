import { email, z } from "zod";

const registerSchema = z.object({
	username: z.string().min(3, "Name must be at least 3 characters long"),
	email: z.email("invalid email format"),
	password: z.string().min(8, "Password must be at least 8 characters long"),
});

const loginSchema = z.object({
	email: z.email("invalid email format"),
	password: z.string().min(8, "Password must be at least 8 characters long"),
});

const userSchema = z.object({
	username: z
		.string()
		.min(3, "Name must be at least 3 characters long")
		.optional(),
	email: z.email("invalid email format").optional(),
});

const querySchema = z.object({ query: z.string() });

export { registerSchema, loginSchema, querySchema, userSchema };
