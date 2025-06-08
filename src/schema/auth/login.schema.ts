import z from "zod"
export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string()
        .min(8, "Password must be at least 12 characters long")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[a-z]/, "Must contain at least one lowercase letter")
        .regex(/[0-9]/, "Must contain at least one number")
        .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\\/?]/, "Must contain at least one special character"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

