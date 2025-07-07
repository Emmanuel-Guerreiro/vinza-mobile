import { apiFetch } from "@/lib/api";
import { User } from "@/modules/auth/types";
import { UpdateUser } from "./types";

export async function updateUser(id: User["id"], data: Partial<UpdateUser>) {
  const response = await apiFetch(`/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return response.json() as Promise<UpdateUser>;
}
