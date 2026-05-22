import { getRefreshToken } from "@/shared/auth/auth-storage"
import { postJson } from "@/shared/api/client"

export type LogoutResponse = {
  message: string
}

export async function logoutUser() {
  const refreshToken = getRefreshToken()
  return await postJson<LogoutResponse, { refresh_token?: string }>(
    "/api/logout",
    refreshToken ? { refresh_token: refreshToken } : {},
    { skipAuth: true, skipUnauthorizedHandler: true },
  )
}
