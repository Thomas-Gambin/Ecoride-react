import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import { loginUser, type LoginRequest } from "@/features/auth/api/login"
import { getMe } from "@/features/auth/api/me"
import { logoutUser } from "@/features/auth/api/logout"
import type { AuthUser } from "@/features/auth/types/user"
import {
  clearAuthSession,
  getRefreshToken,
  getStoredUser,
  loadAuthSession,
  persistAuthSession,
} from "@/shared/auth/auth-storage"
import { refreshAuthSession } from "@/shared/auth/auth-session"
import { setUnauthorizedHandler } from "@/shared/api/client"
import { AuthContext } from "./auth-context"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser())
  const [isLoading, setIsLoading] = useState(true)

  const clearUser = useCallback(() => {
    clearAuthSession()
    setUser(null)
  }, [])

  const applySession = useCallback((nextUser: AuthUser, accessToken: string, refreshToken: string) => {
    persistAuthSession(nextUser, accessToken, refreshToken)
    setUser(nextUser)
  }, [])

  const handleRefreshAndLoadUser = useCallback(async (refreshToken: string): Promise<boolean> => {
    try {
      const authResponse = await refreshAuthSession(refreshToken)
      if (!authResponse) {
        return false
      }

      const meResponse = await getMe()
      const { accessToken, refreshToken: storedRefresh } = loadAuthSession()
      if (accessToken && storedRefresh) {
        applySession(meResponse.user, accessToken, storedRefresh)
      } else {
        setUser(meResponse.user)
      }

      return true
    } catch {
      clearAuthSession()
      setUser(null)
      return false
    }
  }, [applySession])

  const refreshUser = useCallback(async (): Promise<AuthUser | null> => {
    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      clearUser()
      return null
    }

    const ok = await handleRefreshAndLoadUser(refreshToken)
    return ok ? getStoredUser() : null
  }, [clearUser, handleRefreshAndLoadUser])

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearUser()
    })
    return () => setUnauthorizedHandler(null)
  }, [clearUser])

  useEffect(() => {
    const onSessionUpdated = (event: Event) => {
      const detail = (event as CustomEvent<AuthUser>).detail
      if (!detail) return

      const { accessToken, refreshToken } = loadAuthSession()
      if (accessToken && refreshToken) {
        applySession(detail, accessToken, refreshToken)
      } else {
        setUser(detail)
      }
      setIsLoading(false)
    }

    const onSessionRefreshed = (event: Event) => {
      const detail = (event as CustomEvent<AuthUser>).detail
      if (detail) {
        setUser(detail)
      }
    }

    window.addEventListener("ecoride:session-updated", onSessionUpdated)
    window.addEventListener("ecoride:session-refreshed", onSessionRefreshed)
    return () => {
      window.removeEventListener("ecoride:session-updated", onSessionUpdated)
      window.removeEventListener("ecoride:session-refreshed", onSessionRefreshed)
    }
  }, [applySession])

  useEffect(() => {
    const initAuth = async () => {
      const refreshToken = getRefreshToken()

      if (refreshToken) {
        await handleRefreshAndLoadUser(refreshToken)
      } else {
        clearAuthSession()
        setUser(null)
      }

      setIsLoading(false)
    }

    void initAuth()
  }, [handleRefreshAndLoadUser])

  const login = useCallback(
    async (credentials: LoginRequest): Promise<AuthUser> => {
      const res = await loginUser(credentials)
      applySession(res.user, res.token, res.refresh_token)

      try {
        const meResponse = await getMe()
        applySession(meResponse.user, res.token, res.refresh_token)
        setIsLoading(false)
        return meResponse.user
      } catch {
        setIsLoading(false)
        return res.user
      }
    },
    [applySession],
  )

  const logout = useCallback(async () => {
    try {
      await logoutUser()
    } catch {
      /* token peut déjà être révoqué */
    } finally {
      clearUser()
    }
  }, [clearUser])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      login,
      logout,
      refreshUser,
    }),
    [user, isLoading, login, logout, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
