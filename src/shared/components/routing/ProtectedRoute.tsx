import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/shared/hooks/useAuth"

type ProtectedRouteProps = {
  children: ReactNode
  roles?: string[]
}

function hasRequiredRole(userRoles: string[], required: string[]) {
  return required.some((role) => userRoles.includes(role))
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-[40vh] w-full max-w-6xl items-center justify-center px-6 py-14">
        <p className="text-sm text-zinc-600 dark:text-zinc-300" role="status" aria-live="polite">
          Chargement…
        </p>
      </main>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (roles && roles.length > 0 && user && !hasRequiredRole(user.roles, roles)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
