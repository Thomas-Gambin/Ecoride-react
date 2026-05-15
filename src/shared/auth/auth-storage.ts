import type { AuthUser } from "@/features/auth/types/user"

const SESSION_TOKEN_KEY = "ecoride-session-token"
const USER_KEY = "ecoride-user"

export function getSessionToken(): string | null {
  try {
    const token = localStorage.getItem(SESSION_TOKEN_KEY)
    return token && token.length > 0 ? token : null
  } catch {
    return null
  }
}

export function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function persistAuthSession(user: AuthUser, sessionToken?: string): void {
  try {
    const token = sessionToken ?? crypto.randomUUID()
    localStorage.setItem(SESSION_TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  } catch {
    /* quota / mode privé */
  }
}

export function clearAuthSession(): void {
  try {
    localStorage.removeItem(SESSION_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  } catch {
    /* ignore */
  }
}

export function loadAuthSession(): { user: AuthUser | null; sessionToken: string | null } {
  const sessionToken = getSessionToken()
  const user = getStoredUser()
  if (!sessionToken || !user) {
    return { user: null, sessionToken: null }
  }
  return { user, sessionToken }
}
