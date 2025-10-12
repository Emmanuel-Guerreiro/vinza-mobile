import { apiFetch } from "@/lib/api";
import { PaginatedResponse } from "@/lib/api/types";
import { filtersToSearchParams } from "@/lib/util";
import { Bodega, BodegaParams } from "./types";

export const BODERGA_QUERY_KEY = "/bodegas";

export async function getBodegas(
  params: BodegaParams,
): Promise<PaginatedResponse<Bodega>> {
  const response = await apiFetch(
    `${BODERGA_QUERY_KEY}${filtersToSearchParams(params)}`,
  );
  const data = await response.json();

  return data;
}

export async function getBodega(id: Bodega["id"]): Promise<Bodega> {
  const response = await apiFetch(`${BODERGA_QUERY_KEY}/${id}`);
  return response.json();
}
