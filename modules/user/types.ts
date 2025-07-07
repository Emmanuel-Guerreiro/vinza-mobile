import dayjs from "dayjs";
import { z } from "zod";

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
