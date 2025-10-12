import dayjs from "dayjs";
import { z } from "zod";
import { PasswordSchema } from "../auth/types";

export const UpdateUserSchema = z.object({
  nombre: z.string().optional(),
  apellido: z.string().optional(),
  email: z.string().email().optional(),
  fecha_nacimiento: z
    .date()
    .optional()
    .refine(
      (date) =>
        !date ||
        dayjs(date).isBefore(dayjs()) ||
        dayjs(date).isSame(dayjs(), "day"),
      {
        message: "La fecha de nacimiento no puede ser en el futuro",
      },
    ),
  // roles omitted
});

export type UpdateUser = z.infer<typeof UpdateUserSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export const changePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Contraseña actual es requerida"),
    newPassword: PasswordSchema,
    repeatPassword: z.string().min(1, "Repetir contraseña es requerida"),
  })
  .refine((data) => data.newPassword === data.repeatPassword, {
    message: "Las contraseñas no coinciden",
    path: ["repeatPassword"],
  });

export type ChangePasswordForm = z.infer<typeof changePasswordFormSchema>;
export type ChangePasswordRequest = z.infer<typeof changePasswordSchema>;
