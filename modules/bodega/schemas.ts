import { PaginationSchema } from "@/lib/pagination";
import { z } from "zod";

export const BodegaParamsSchema = PaginationSchema.extend({
  nombre: z.string().optional(),
});
