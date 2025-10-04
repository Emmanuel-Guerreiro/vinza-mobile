import { apiFetch } from "@/lib/api";
import { PaginatedResponse } from "@/lib/api/types";
import { filtersToSearchParams } from "@/lib/util";
import { Faq, FaqListParams } from "./types";

export const FAQ_QUERY_KEY = "/faqs";

export async function getFaqs(
  params: FaqListParams,
): Promise<PaginatedResponse<Faq>> {
  const response = await apiFetch(
    `${FAQ_QUERY_KEY}${filtersToSearchParams(params)}`,
  );
  return response.json();
}
