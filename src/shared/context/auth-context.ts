import { createContext } from "react"
import type { AuthUser } from "@/features/auth/types/user"
import type { LoginRequest } from "@/features/auth/api/login"

export type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<AuthUser>
  logout: () => Promise<void>
  refreshUser: () => Promise<AuthUser | null>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
