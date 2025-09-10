import { apiFetch } from "@/lib/api";
import { PaginatedResponse } from "@/lib/api/types";
import { filtersToSearchParams } from "@/lib/util";
import {
  CategoriaEvento,
  CreateValoracion,
  EstadoEvento,
  Evento,
  EventoParams,
  InstanciaEvento,
} from "./types";

export const EVENTO_QUERY_KEY = "/eventos";
export const INSTANCIA_QUERY_KEY = "/instancia-eventos";
export const CATEGORIA_EVENTOS_QUERY_KEY = "/categoria-eventos";
export const ESTADO_EVENTOS_QUERY_KEY = "/estado-eventos";
export const VALORACIONES_QUERY_KEY = "/valoraciones";

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

export async function findEstadosEventos(): Promise<
  PaginatedResponse<EstadoEvento>
> {
  const response = await apiFetch(ESTADO_EVENTOS_QUERY_KEY);
  return response.json();
}

export async function puntuarEvento(data: CreateValoracion): Promise<void> {
  const response = await apiFetch(VALORACIONES_QUERY_KEY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al puntuar el evento");
  }
}
