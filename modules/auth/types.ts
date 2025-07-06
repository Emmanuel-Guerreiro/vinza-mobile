/**
 * Schemas and types for the auth module
 */
import { z } from "zod";
import { Bodega } from "../bodega/types";

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const RegisterRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  name: z.string().min(1),
});

export const RecoverPasswordRequestSchema = z.object({
  email: z.string().email(),
});

export const ResetPasswordRequestSchema = z.object({
  code: z.string().min(1),
  password: z.string().min(1),
});

export const ValidateAccountRequestSchema = z.object({
  code: z.string().min(1),
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
}

export type UserLogged = User & {
  token: string;
};
