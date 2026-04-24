import { postJson } from "@/shared/api/client"

export type ResendVerificationRequest = {
  email: string
}

export type ResendVerificationResponse = {
  message: string
}

export async function resendVerificationEmail(body: ResendVerificationRequest) {
  return await postJson<ResendVerificationResponse, ResendVerificationRequest>(
    "/api/resend-verification-email",
    body,
  )
}
