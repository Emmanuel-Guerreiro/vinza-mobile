import { apiFetch } from "@/lib/api";
import { PaginatedResponse } from "@/lib/api/types";
import { filtersToSearchParams } from "@/lib/util";
import { Evento, EventoParams } from "./types";

export const EVENTO_QUERY_KEY = "/eventos";

export async function getEvento(id: Evento["id"]): Promise<Evento> {
  const response = await apiFetch(`${EVENTO_QUERY_KEY}/${id}`);
  return response.json();
}

export async function getEventos(
  params: EventoParams,
): Promise<PaginatedResponse<Evento>> {
  const response = await apiFetch(
    `${EVENTO_QUERY_KEY}?${filtersToSearchParams(params)}`,
  );
  return response.json();
}
