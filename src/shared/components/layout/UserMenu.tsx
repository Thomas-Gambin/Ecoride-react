import { useCallback, useEffect, useId, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { LogOut, Plus, User } from "lucide-react"
import { useAuth } from "@/shared/hooks/useAuth"
import { cn } from "@/shared/lib/utils"

const ringOffset =
  "focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950"

const menuItemClass = cn(
  "flex w-full cursor-pointer items-center rounded-xl px-3 py-2.5 text-sm font-medium outline-none transition-colors",
  "text-zinc-800 hover:bg-emerald-50 hover:text-emerald-900 dark:text-zinc-100 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-100",
  "focus-visible:ring-2 focus-visible:ring-emerald-700/30",
)

type UserMenuProps = {
  variant: "desktop" | "mobile"
  onNavigate?: () => void
  className?: string
}

function ConnexionLink({
  variant,
  onNavigate,
  className,
}: Pick<UserMenuProps, "variant" | "onNavigate" | "className">) {
  if (variant === "mobile") {
    return (
      <Link
        to="/login"
        onClick={onNavigate}
        className={cn(
          "flex w-full cursor-pointer items-center justify-center rounded-2xl bg-transparent px-4 py-3.5 text-base font-semibold outline-none transition-colors duration-200",
          "text-zinc-800 hover:text-emerald-800 dark:text-zinc-100 dark:hover:text-emerald-200",
          "focus-visible:ring-2 focus-visible:ring-emerald-700/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-900",
          className,
        )}
      >
        Connexion
      </Link>
    )
  }

  return (
    <Link
      to="/login"
      className={cn(
        "group relative cursor-pointer rounded-full px-4 py-2.5 text-base font-medium outline-none transition-colors duration-200 ease-out",
        "text-zinc-700 hover:text-emerald-600 dark:text-zinc-200 dark:hover:text-emerald-300",
        "focus-visible:ring-2 focus-visible:ring-emerald-700/30",
        ringOffset,
        className,
      )}
    >
      <span className="relative z-10">Connexion</span>
    </Link>
  )
}

export function UserMenu({ variant, onNavigate, className }: UserMenuProps) {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, close])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        close()
      }
    }
    document.addEventListener("mousedown", onPointerDown)
    return () => document.removeEventListener("mousedown", onPointerDown)
  }, [open, close])

  const handleLogout = async () => {
    close()
    onNavigate?.()
    await logout()
    navigate("/login", { replace: true })
  }

  const handleNavClick = () => {
    close()
    onNavigate?.()
  }

  if (isLoading) {
    return (
      <span
        className={cn(
          "inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-stone-200/80 bg-white/70 dark:border-zinc-700/90 dark:bg-zinc-900/70",
          className,
        )}
        aria-hidden
      />
    )
  }

  if (!isAuthenticated || !user) {
    return <ConnexionLink variant={variant} onNavigate={onNavigate} className={className} />
  }

  const menuItems = (
    <>
      <Link to="/profil" role="menuitem" onClick={handleNavClick} className={menuItemClass}>
        Mon compte
      </Link>
      <Link to="/trajets/creer" role="menuitem" onClick={handleNavClick} className={menuItemClass}>
        Créer un trajet
      </Link>
      <button
        type="button"
        role="menuitem"
        onClick={handleLogout}
        className={cn(
          menuItemClass,
          "gap-2 text-rose-700 hover:bg-rose-50 dark:text-rose-200 dark:hover:bg-rose-500/10",
        )}
      >
        <LogOut className="h-4 w-4 shrink-0" aria-hidden />
        Se déconnecter
      </button>
    </>
  )

  if (variant === "mobile") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("flex flex-col gap-1", className)}
      >
        <p className="px-1 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Compte</p>
        <Link
          to="/profil"
          onClick={handleNavClick}
          className="flex cursor-pointer items-center gap-2 rounded-2xl px-3 py-3 text-base font-medium text-zinc-800 outline-none transition-colors hover:bg-white/80 dark:text-zinc-100 dark:hover:bg-zinc-800/80"
        >
          <User className="h-4 w-4" aria-hidden />
          Mon compte
        </Link>
        <Link
          to="/trajets/creer"
          onClick={handleNavClick}
          className="flex cursor-pointer items-center gap-2 rounded-2xl px-3 py-3 text-base font-medium text-zinc-800 outline-none transition-colors hover:bg-white/80 dark:text-zinc-100 dark:hover:bg-zinc-800/80"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Créer un trajet
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full cursor-pointer items-center gap-2 rounded-2xl px-3 py-3 text-left text-base font-medium text-rose-700 outline-none transition-colors hover:bg-rose-50 dark:text-rose-200 dark:hover:bg-rose-500/10"
        >
          <LogOut className="h-4 w-4" aria-hidden />
          Se déconnecter
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div ref={containerRef} className={cn("relative", className)} layout>
      <button
        type="button"
        aria-label="Menu compte"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-2xl border outline-none transition-[background-color,border-color,transform] duration-300",
          "border-stone-200/80 bg-white/70 text-zinc-800 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-sm",
          "hover:border-stone-300 hover:bg-white",
          "dark:border-zinc-700/90 dark:bg-zinc-900/70 dark:text-zinc-100 dark:shadow-[0_1px_0_rgba(0,0,0,0.25)_inset] dark:hover:border-zinc-600 dark:hover:bg-zinc-800/90",
          "focus-visible:ring-2 focus-visible:ring-emerald-700/35",
          ringOffset,
          "active:scale-[0.97]",
          open && "border-emerald-300/80 bg-emerald-50/50 dark:border-emerald-600/40 dark:bg-emerald-500/10",
        )}
      >
        <User className="h-5 w-5" strokeWidth={1.75} aria-hidden />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={menuId}
            role="menu"
            aria-label="Menu compte utilisateur"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "absolute right-0 top-[calc(100%+0.5rem)] z-[60] min-w-[12.5rem] overflow-hidden rounded-2xl border p-1.5 shadow-lg",
              "border-stone-200/80 bg-white/95 backdrop-blur-md dark:border-zinc-700/90 dark:bg-zinc-900/95",
            )}
          >
            {menuItems}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  )
}
