import { apiFetch } from "@/lib/api";
import { ChangePasswordRequest, UpdateUser } from "./types";

export async function updateMyUser(data: Partial<UpdateUser>) {
  const response = await apiFetch(`/users/me`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return response.json() as Promise<UpdateUser>;
}

export async function changePassword(data: ChangePasswordRequest) {
  const response = await apiFetch(`/auth/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return response.json();
}
