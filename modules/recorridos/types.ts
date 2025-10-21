import z from "zod";
import { InstanciaEvento } from "../evento/types";
import {
  createReservaSchema,
  findAllRecorridosParamsSchema,
  updateBookingSchema,
  updateRecorridoNameSchema,
} from "./schema";

export enum EstadoRecorridoEnum {
  PENDIENTE = "PENDIENTE",
  CONFIRMADO = "CONFIRMADO",
  CANCELADO = "CANCELADO",
}

export interface Recorrido {
  created_at: Date;
  deleted_at: Date | null;
  last_optimization: Date | null;
  userId: number;
  id: number;
  name: string;
  reservas: Reserva[];
  estados: EstadoRecorrido[];
}

export interface EstadoRecorrido {
  id: number;
  nombre: EstadoRecorridoEnum;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Reserva {
  id: number;
  precio: number;
  cantidadGente: number;
  instanciaEventoId: number;
  recorridoId: number;
  estados?: EstadoReserva[];
  instanciaEvento: InstanciaEvento;
}

export interface EstadoReserva {
  id: number;
  nombre: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export type RecorridoParams = z.infer<typeof findAllRecorridosParamsSchema>;

export type UpdateBooking = z.infer<typeof updateBookingSchema>;

export type CreateReserva = z.infer<typeof createReservaSchema>;

export type UpdateRecorridoName = z.infer<typeof updateRecorridoNameSchema>;
