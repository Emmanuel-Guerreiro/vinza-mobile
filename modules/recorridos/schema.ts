import { paginationAndOrderSchema } from "@/lib/pagination";
import z from "zod";
import { EstadoRecorridoEnum } from "./types";

const recorridoOrderByAttributes = ["id", "created_at", "deleted_at"];
export const findAllRecorridosParamsSchema = paginationAndOrderSchema(
  recorridoOrderByAttributes,
).extend({
  userId: z.number().int().positive().optional(),
  estados: z.array(z.nativeEnum(EstadoRecorridoEnum)).optional(),
});

export const updateBookingSchema = z.object({
  cantidadGente: z.number().int().positive().optional(),
});
