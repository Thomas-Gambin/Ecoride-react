import type { ReactNode } from "react"
import { AppToaster } from "@/shared/components/ui/AppToaster"
import { AuthProvider } from "@/shared/context/AuthProvider"
import { ThemeProvider } from "@/shared/context/ThemeProvider"

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
        <AppToaster />
      </AuthProvider>
    </ThemeProvider>
  )
}
