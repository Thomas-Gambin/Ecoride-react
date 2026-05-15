import { postJson } from "@/shared/api/client"

export type ResendVerificationRequest = {
  email: string
}

export type ResendVerificationResponse = {
  message: string
  code?: "ALREADY_VERIFIED" | "EMAIL_SEND_FAILED" | "VALIDATION_ERROR"
}

export async function resendVerificationEmail(body: ResendVerificationRequest) {
  return await postJson<ResendVerificationResponse, ResendVerificationRequest>(
    "/api/resend-verification-email",
    body,
  )
}
