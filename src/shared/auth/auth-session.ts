import type { AuthUser } from "@/features/auth/types/user"
import {
  clearAuthSession,
  getRefreshToken,
  persistAuthSession,
} from "@/shared/auth/auth-storage"

export type RefreshTokenResponse = {
  token: string
  refresh_token: string
  refresh_token_expiration?: number
  user: AuthUser
}

let inflightRefresh: Promise<AuthUser | null> | null = null

function getApiBaseUrl(): string {
  const env = import.meta.env.VITE_API_BASE_URL as string | undefined
  return env?.replace(/\/+$/, "") ?? ""
}

async function callRefreshApi(refreshToken: string): Promise<RefreshTokenResponse> {
  const res = await fetch(`${getApiBaseUrl()}/api/token/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  })

  const text = await res.text()
  const data = text ? (JSON.parse(text) as unknown) : null

  if (!res.ok) {
    const message =
      typeof data === "object" && data !== null && typeof (data as { message?: string }).message === "string"
        ? (data as { message: string }).message
        : "Impossible de renouveler la session."
    throw new Error(message)
  }

  return data as RefreshTokenResponse
}

/** Renouvelle la session via le refresh token stocké en localStorage (comme aoptia). */
export async function refreshAuthSession(refreshTokenOverride?: string): Promise<AuthUser | null> {
  const refreshToken = refreshTokenOverride ?? getRefreshToken()
  if (!refreshToken) {
    return null
  }

  if (inflightRefresh) {
    return inflightRefresh
  }

  inflightRefresh = (async () => {
    try {
      const response = await callRefreshApi(refreshToken)
      persistAuthSession(response.user, response.token, response.refresh_token)
      window.dispatchEvent(new CustomEvent<AuthUser>("ecoride:session-refreshed", { detail: response.user }))
      return response.user
    } catch {
      clearAuthSession()
      return null
    } finally {
      inflightRefresh = null
    }
  })()

  return inflightRefresh
}
