import { postJson } from "@/shared/api/client"

export type LogoutResponse = {
  message: string
}

export async function logoutUser() {
  return await postJson<LogoutResponse, Record<string, never>>("/api/logout", {})
}
