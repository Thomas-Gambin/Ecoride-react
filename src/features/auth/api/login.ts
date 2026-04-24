import { postJson } from "@/shared/api/client"

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  message: string
}

export async function loginUser(body: LoginRequest) {
  return await postJson<LoginResponse, LoginRequest>("/api/login", body, { credentials: "include" })
}
