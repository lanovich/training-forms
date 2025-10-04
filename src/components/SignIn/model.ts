import z from "zod";

export const SignInSchema = z.object({
  email: z
    .string()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Некорректный формат email"),
  password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
});

export type SignInData = z.infer<typeof SignInSchema>;
export type SignInErrors = Partial<Record<keyof SignInData, string>>;
