import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
  }),
});

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string().min(10),
    address: z.string().optional(),
    branchId: z.string().uuid().optional(),
  }),
});

export const refreshSchema = z.object({
  body: z.object({ refreshToken: z.string() }),
});

export const forgotSchema = z.object({
  body: z.object({ email: z.string().email() }),
});

export const resetSchema = z.object({
  body: z.object({
    token: z.string(),
    password: z.string().min(6),
  }),
});
