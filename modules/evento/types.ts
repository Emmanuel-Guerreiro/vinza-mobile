import z from "zod";
import { Sucursal } from "../bodega/types";
import { EventoParamsSchema } from "./schemas";

// Base interfaces for the models
export interface Evento {
  id: number;
  nombre: string;
  descripcion: string;
  cupo: string;
  precio: number;
  sucursal?: Sucursal;
  estado?: EstadoEvento;
  categoria?: CategoriaEvento;
  recurrencias?: RecurrenciaEvento[];
}

export interface CategoriaEvento {
  id: number;
  nombre: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  eventos?: Evento[];
}

export interface RecurrenciaEvento {
  id: number;
  dia: DiaSemana;
  hora: HoraEvento;
  fecha_desde: Date;
  fecha_hasta: Date;
  eventoId: number;
  evento?: Evento;
}

export interface EstadoEvento {
  id: number;
  nombre: string;
}

// Enum types
export enum DiaSemana {
  LUNES = "LUNES",
  MARTES = "MARTES",
  MIERCOLES = "MIERCOLES",
  JUEVES = "JUEVES",
  VIERNES = "VIERNES",
  SABADO = "SABADO",
  DOMINGO = "DOMINGO",
}

export enum HoraEvento {
  // Add the specific hour values based on your DiaSemana enum
  // This is a placeholder - you'll need to define the actual values
}

// Creation attributes (for creating new records)
export interface EventoCreationAttributes {
  nombre: string;
  descripcion: string;
  cupo: string;
  precio: number;
  sucursalId: number;
  estadoId?: number;
  categoriaId?: number;
}

export interface CategoriaEventoCreationAttributes {
  nombre: string;
}

export interface RecurrenciaEventoCreationAttributes {
  dia: DiaSemana;
  hora: HoraEvento;
  fecha_desde: Date;
  fecha_hasta: Date;
  eventoId: number;
}

// Update attributes (for updating existing records)
export type EventoUpdateAttributes = Partial<EventoCreationAttributes>;
export type CategoriaEventoUpdateAttributes =
  Partial<CategoriaEventoCreationAttributes>;
export type RecurrenciaEventoUpdateAttributes =
  Partial<RecurrenciaEventoCreationAttributes>;

export type EventoParams = z.infer<typeof EventoParamsSchema>;
