import { appEvents } from "../app-events";
import { parseApiError } from "../error";
import { storageService } from "../storage";

// Enhanced fetch function that maintains the same interface as native fetch
export const apiFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> => {
  const headers = new Headers(init?.headers);

  const token = (await storageService.getSession())?.token;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Set Content-Type to application/json if body is present and Content-Type is not already set
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const enhancedInit: RequestInit = {
    ...init,
    headers,
  };
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}${input}`,
    enhancedInit,
  );

  if (!response.ok) {
    const error = await parseApiError(response);
    if (error.key == "app.auth.invalid_or_expired_code") {
      appEvents.emit("logout");
    }

    if (error.key == "app.auth.unauthorized") {
      appEvents.emit("unauthorized");
    }

    throw error;
  }
  return response;
};

export type ApiFetchFunction = typeof apiFetch;
