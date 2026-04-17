import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import { ThemeContext } from "./theme-context"
import type { Theme } from "../types/theme"

const STORAGE_KEY = "ecoride-theme"

function getStoredTheme(): Theme | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === "light" || v === "dark") return v
  } catch {
    /* ignore */
  }
  return null
}

function applyDomTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === "dark") root.classList.add("dark")
  else root.classList.remove("dark")
}

function resolveInitialTheme(): Theme {
  const stored = getStoredTheme()
  if (stored) return stored
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark"
  }
  return "light"
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => resolveInitialTheme())

  useEffect(() => {
    applyDomTheme(theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"))
  }, [])

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
