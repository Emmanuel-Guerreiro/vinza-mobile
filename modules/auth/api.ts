import { apiFetch } from "../../lib/api";
import { LoginRequest, RegisterRequest, UserLogged } from "./types";

export async function login(data: LoginRequest) {
  const response = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return response.json() as Promise<UserLogged>;
}

export async function register(data: RegisterRequest) {
  const response = await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return response.json() as Promise<UserLogged>;
}

export async function recoverPassword(email: string) {
  return apiFetch("/auth/recover-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, password: string) {
  return apiFetch("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
}

export async function validateAccount(token: string) {
  return apiFetch("/auth/validate-account", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}
