import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import { loginUser, type LoginRequest } from "@/features/auth/api/login"
import { logoutUser } from "@/features/auth/api/logout"
import type { AuthUser } from "@/features/auth/types/user"
import {
  clearAuthSession,
  loadAuthSession,
  persistAuthSession,
} from "@/shared/auth/auth-storage"
import { setUnauthorizedHandler } from "@/shared/api/client"
import { AuthContext } from "./auth-context"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const clearUser = useCallback(() => {
    clearAuthSession()
    setUser(null)
  }, [])

  const refreshUser = useCallback(async (): Promise<AuthUser | null> => {
    const { user: stored } = loadAuthSession()
    setUser(stored)
    return stored
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(clearUser)
    return () => setUnauthorizedHandler(null)
  }, [clearUser])

  useEffect(() => {
    const onSessionUpdated = (event: Event) => {
      const detail = (event as CustomEvent<AuthUser>).detail
      if (detail) {
        persistAuthSession(detail)
        setUser(detail)
        setIsLoading(false)
      }
    }
    window.addEventListener("ecoride:session-updated", onSessionUpdated)
    return () => window.removeEventListener("ecoride:session-updated", onSessionUpdated)
  }, [])

  useEffect(() => {
    const { user: stored } = loadAuthSession()
    setUser(stored)
    setIsLoading(false)
  }, [])

  const login = useCallback(async (credentials: LoginRequest): Promise<AuthUser> => {
    const res = await loginUser(credentials)
    if (!res.user) {
      throw new Error(JSON.stringify({ message: "Impossible de récupérer le profil utilisateur." }))
    }
    persistAuthSession(res.user)
    setUser(res.user)
    setIsLoading(false)
    return res.user
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutUser()
    } catch {
      /* session peut déjà être expirée */
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
