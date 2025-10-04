import z from "zod";

export const SignUpSchema = z
  .object({
    firstName: z.string().min(1, "Имя обязательно для заполнения"),
    nickName: z.string().min(1, "Ник обязателен для заполнения"),
    email: z
      .string()
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Некорректный формат email"),
    gender: z
      .union([z.enum(["male", "female"]), z.undefined(), z.null()])
      .refine((val) => val === "male" || val === "female", {
        message: "Пол обязателен для выбора",
      }),
    password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
    confirmPassword: z.string().min(6, "Повторите пароль"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export type SignUpData = z.infer<typeof SignUpSchema>;
export type SignUpErrors = Partial<Record<keyof SignUpData, string>>;
