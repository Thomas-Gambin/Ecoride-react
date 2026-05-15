import { useContext } from "react"
import { AuthContext, type AuthContextValue } from "@/shared/context/auth-context"

/** Retourne le contexte auth ou `null` hors AuthProvider (pages publiques). */
export function useOptionalAuth(): AuthContextValue | null {
  return useContext(AuthContext)
}

/** Réservé aux pages sous AuthProvider (login, routes protégées). */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider.")
  }
  return ctx
}
