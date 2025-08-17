import { apiFetch } from "@/lib/api";
import { UpdateUser } from "./types";

export async function updateMyUser(data: Partial<UpdateUser>) {
  const response = await apiFetch(`/users/me`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return response.json() as Promise<UpdateUser>;
}
