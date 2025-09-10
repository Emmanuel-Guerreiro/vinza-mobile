import { apiFetch } from "@/lib/api";
import { PaginatedResponse } from "@/lib/api/types";
import { filtersToSearchParams } from "@/lib/util";
import {
  CreateReserva,
  Recorrido,
  RecorridoParams,
  UpdateBooking,
} from "./types";

export const RECORRIDOS_QUERY_KEY = "/recorrido";
export const BOOKING_QUERY_KEY = "/reserva";

export async function getRecorridos(
  params: RecorridoParams,
): Promise<PaginatedResponse<Recorrido>> {
  const response = await apiFetch(
    `${RECORRIDOS_QUERY_KEY}${filtersToSearchParams(params)}`,
  );
  return response.json();
}

export async function getRecorrido(id: number): Promise<Recorrido> {
  const response = await apiFetch(`${RECORRIDOS_QUERY_KEY}/${id}`);
  return response.json();
}

export async function deleteBooking(id: number): Promise<void> {
  await apiFetch(`${BOOKING_QUERY_KEY}/${id}`, {
    method: "DELETE",
  });
}

export async function updateBooking(
  id: number,
  data: UpdateBooking,
): Promise<void> {
  await apiFetch(`${BOOKING_QUERY_KEY}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function cancelarRecorrido(id: number): Promise<void> {
  await apiFetch(`${RECORRIDOS_QUERY_KEY}/${id}`, {
    method: "DELETE",
  });
}

export async function confirmarRecorrido(id: number): Promise<void> {
  await apiFetch(`${RECORRIDOS_QUERY_KEY}/${id}/confirmar`, {
    method: "POST",
  });
}

export async function crearReserva(data: CreateReserva): Promise<void> {
  await apiFetch(BOOKING_QUERY_KEY, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
