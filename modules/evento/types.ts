import z from "zod";
import { Sucursal } from "../bodega/types";
import {
  createValoracionSchema,
  EventoFilterSchema,
  EventoParamsSchema,
} from "./schemas";

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
  valoracionMedia?: ValoracionMedia[];
  instancias?: InstanciaEvento[];
  multimedia?: Multimedia[];
}

export type Multimedia = {
  id: number;
  url: string;
  es_portada: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  eventoId: number;
  tipoId: number;
};

export interface ValoracionMedia {
  cantidad_valoraciones: number;
  created_at: string;
  deleted_at: null;
  eventoId: number;
  id: number;
  updated_at: string;
  valor_medio: string;
}

export interface InstanciaEvento {
  id: number;
  estado: InstanciaEventoEstado;
  estadoId: number;

  eventoId: number;
  evento?: Evento;
  fecha: string;
  recurrenciaEventoId: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface InstanciaEventoEstado {
  created_at: string;
  deleted_at: string | null;
  id: number;
  nombre: EstadoInstanciaEventoEnum;
  updated_at: string;
}

export enum EstadoInstanciaEventoEnum {
  ACTIVA = "ACTIVA",
  FINALIZADA = "FINALIZADA",
  SUSPENDIDA = "SUSPENDIDA",
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

export enum EstadoEventoEnum {
  ACTIVO = "ACTIVO",
  SUSPENDIDO = "SUSPENDIDO",
  FINALIZADO = "FINALIZADO",
}

export type EventoFilterFormData = z.infer<typeof EventoFilterSchema>;

export type CreateValoracion = z.infer<typeof createValoracionSchema>;
