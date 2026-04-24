import { postJson } from "@/shared/api/client"

export type RegisterRequest = {
  pseudo: string
  email: string
  password: string
}

export type RegisterResponse = {
  message: string
  requiresEmailVerification: boolean
}

export async function registerUser(body: RegisterRequest) {
  return await postJson<RegisterResponse, RegisterRequest>("/api/register", body)
}

