/**
 * Schemas and types for the auth module
 */
import { z } from "zod";
import { Bodega } from "../bodega/types";

export const LoginRequestSchema = z.object({
  email: z.string(), //.email("Email inválido"),
  password: z.string().min(1, "Contraseña requerida"),
});

export const RegisterRequestSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "La contraseña debe contener al menos una mayúscula")
    .regex(/[a-z]/, "La contraseña debe contener al menos una minúscula")
    .regex(/[0-9]/, "La contraseña debe contener al menos un número")
    .regex(
      /[^A-Za-z0-9]/,
      "La contraseña debe contener al menos un caracter especial",
    ),
  name: z.string().min(1, "Nombre requerido"),
});

export const RecoverPasswordRequestSchema = z.object({
  email: z.string().email("Email inválido"),
});

export const ResetPasswordRequestSchema = z.object({
  code: z.string().min(1, "Código requerido"),
  password: z.string().min(1),
});

export const ValidateAccountRequestSchema = z.object({
  code: z.string().min(6),
  email: z.string().email(),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type RecoverPasswordRequest = z.infer<
  typeof RecoverPasswordRequestSchema
>;
export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;
export type ValidateAccountRequest = z.infer<
  typeof ValidateAccountRequestSchema
>;

export interface Permission {
  id: number;
  nombre: string;
  clave: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface Rol {
  id: number;
  nombre: string;
  permisos: Permission[];
  usuarios: User[];
  bodegaId?: number;
  bodega?: Bodega;
}

export interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  validado?: Date;
  fecha_nacimiento?: Date;
  roles: Rol[];
  bodega?: Bodega;
  created_at?: Date;
}

export type UserLogged = User & {
  token: string;
};
