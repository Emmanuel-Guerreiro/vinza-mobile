import { apiFetch } from "@/lib/api";
import { PaginatedResponse } from "@/lib/api/types";
import { filtersToSearchParams } from "@/lib/util";
import {
  CategoriaEvento,
  Evento,
  EventoParams,
  InstanciaEvento,
} from "./types";

export const EVENTO_QUERY_KEY = "/eventos";
export const INSTANCIA_QUERY_KEY = "/instancia-eventos";
export const CATEGORIA_EVENTOS_QUERY_KEY = "/categoria-eventos";

export async function getEvento(id: Evento["id"]): Promise<Evento> {
  const response = await apiFetch(`${EVENTO_QUERY_KEY}/${id}`);
  return response.json();
}

export async function getEventoByInstanciaId(
  instanciaId: InstanciaEvento["id"],
): Promise<Evento> {
  const response = await apiFetch(
    `${EVENTO_QUERY_KEY}/instancia/${instanciaId}`,
  );
  return response.json();
}

export async function getEventos(
  params: EventoParams,
): Promise<PaginatedResponse<Evento>> {
  const response = await apiFetch(
    `${EVENTO_QUERY_KEY}${filtersToSearchParams(params)}`,
  );
  return response.json();
}

export async function findCategoriasEventos(): Promise<
  PaginatedResponse<CategoriaEvento>
> {
  const response = await apiFetch(CATEGORIA_EVENTOS_QUERY_KEY);
  return response.json();
}
