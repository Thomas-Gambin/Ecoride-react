import { postJson } from "@/shared/api/client"

export type VerifyEmailRequest = {
  token: string
}

export type VerifyEmailResponse = {
  message: string
}

export async function verifyEmail(body: VerifyEmailRequest) {
  return await postJson<VerifyEmailResponse, VerifyEmailRequest>("/api/verify-email", body)
}
