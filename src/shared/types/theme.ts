export type Theme = "light" | "dark"

export type ThemeContextValue = {
  theme: Theme
  setTheme: (t: Theme) => void
  toggleTheme: () => void
}
