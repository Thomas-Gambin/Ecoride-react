import { postJson } from "@/shared/api/client"
import type { AuthUser } from "@/features/auth/types/user"

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  message: string
  user?: AuthUser
}

export async function loginUser(body: LoginRequest) {
  return await postJson<LoginResponse, LoginRequest>("/api/login", body)
}
