import { storageService } from "../storage";

// Enhanced fetch function that maintains the same interface as native fetch
export const apiFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> => {
  const headers = new Headers(init?.headers);

  const token = storageService.getSession()?.token;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const enhancedInit: RequestInit = {
    ...init,
    headers,
  };
  return fetch(`${process.env.EXPO_PUBLIC_API_URL}${input}`, enhancedInit);
};

export type ApiFetchFunction = typeof apiFetch;
