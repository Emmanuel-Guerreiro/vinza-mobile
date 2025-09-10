import { paginationAndOrderSchema } from "@/lib/pagination";
import z from "zod";

const eventoOrderByAttributes = [
  "id",
  "nombre",
  "precio",
  "descripcion",
  "cupo",
  "sucursalId",
  "created_at",
  "updated_at",
  "deleted_at",
];

export const EventoParamsSchema = paginationAndOrderSchema(
  eventoOrderByAttributes,
).extend({
  sucursalId: z.coerce.number().optional(),
  categoriaId: z.coerce.number().optional(),
  estadoId: z.coerce.number().optional(),
  bodegaId: z.coerce.number().optional(),
  fechaDesde: z.string().datetime().optional(),
  fechaHasta: z.string().datetime().optional(),
  precioMinimo: z.coerce.number().min(0).optional(),
  precioMaximo: z.coerce.number().min(0).optional(),
  puntuacionMinima: z.coerce.number().min(0).max(5).optional(),
  nombre: z.string().optional(),
});

export const EventoFilterSchema = z.object({
  puntuacionMinima: z.number().min(1).max(5).optional(),
  categoriaId: z.number().optional(),
  precioMinimo: z.number().min(0).optional(),
  precioMaximo: z.number().min(0).optional(),
  bodegaId: z.number().optional(),
});

export type EventoFilterFormData = z.infer<typeof EventoFilterSchema>;
