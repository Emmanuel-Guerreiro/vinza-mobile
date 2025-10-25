import z from "zod";
import { BodegaParamsSchema } from "./schemas";

export interface Bodega {
  id: number;
  nombre: string;
  descripcion: string;
  sucursales?: Sucursal[];
}

export interface Sucursal {
  id: number;
  nombre: string;
  es_principal: boolean;
  direccion: string;
  aclaraciones?: string;
  bodegaId: number;
  bodega?: Bodega;
  latitude: number;
  longitude: number;
}

export type BodegaParams = z.infer<typeof BodegaParamsSchema>;
