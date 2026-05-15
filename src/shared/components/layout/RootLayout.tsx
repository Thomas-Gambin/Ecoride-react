import { Outlet } from "react-router-dom"
import Header from "./Header"

export function RootLayout() {
  return (
    <div className="min-h-screen bg-white font-sans text-zinc-800 antialiased transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-100">
      <Header />
      <Outlet />
    </div>
  )
}
