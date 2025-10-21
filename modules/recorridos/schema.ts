import { paginationAndOrderSchema } from "@/lib/pagination";
import z from "zod";

export enum EstadoRecorridoEnum {
  PENDIENTE = "PENDIENTE",
  CONFIRMADO = "CONFIRMADO",
  CANCELADO = "CANCELADO",
}

const recorridoOrderByAttributes = ["id", "created_at", "deleted_at"];
export const findAllRecorridosParamsSchema = paginationAndOrderSchema(
  recorridoOrderByAttributes,
).extend({
  userId: z.number().int().positive().optional(),
  estados: z.nativeEnum(EstadoRecorridoEnum).optional(),
});

export const updateBookingSchema = z.object({
  cantidadGente: z.number().int().positive().optional(),
});

export const createReservaSchema = z.object({
  cantidadGente: z.coerce.number(),
  instanciaEventoId: z.coerce.number(),
  recorridoId: z.coerce.number().optional(),
  name: z.string().optional(),
});

export const updateRecorridoNameSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
});
