import type { AuthUser } from "@/features/auth/types/user"

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "ecoride-access-token",
  REFRESH_TOKEN: "ecoride-refresh-token",
  USER: "ecoride-user",
} as const

export function getAccessToken(): string | null {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    return token && token.length > 0 ? token : null
  } catch {
    return null
  }
}

export function getRefreshToken(): string | null {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
    return token && token.length > 0 ? token : null
  } catch {
    return null
  }
}

export function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER)
    if (!raw) return null
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function persistAuthSession(user: AuthUser, accessToken: string, refreshToken: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  } catch {
    /* quota / mode privé */
  }
}

export function clearAuthSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
  } catch {
    /* ignore */
  }
}

export function loadAuthSession(): {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
} {
  return {
    user: getStoredUser(),
    accessToken: getAccessToken(),
    refreshToken: getRefreshToken(),
  }
}
