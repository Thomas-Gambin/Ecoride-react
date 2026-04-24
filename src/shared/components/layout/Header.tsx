import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, Moon, Sun, X } from "lucide-react"
import { Link } from "react-router-dom"
import { useTheme } from "../../hooks/useTheme"
import { cn } from "../../lib/utils"

const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/covoiturages", label: "Covoiturages" },
  { href: "/contact", label: "Contact" },
] as const

const ringOffset =
  "focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950"

function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()
  const dark = theme === "dark"

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? "Passer au thème clair" : "Passer au thème sombre"}
      aria-pressed={dark}
      className={cn(
        "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border outline-none transition-[background-color,border-color,color,transform] duration-300",
        "border-stone-200/80 bg-white/70 text-zinc-800 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-sm",
        "hover:border-stone-300 hover:bg-white",
        "dark:border-zinc-700/90 dark:bg-zinc-900/70 dark:text-zinc-100 dark:shadow-[0_1px_0_rgba(0,0,0,0.25)_inset] dark:hover:border-zinc-600 dark:hover:bg-zinc-800/90",
        "focus-visible:ring-2 focus-visible:ring-emerald-700/35",
        ringOffset,
        "active:scale-[0.97]",
        className
      )}
    >
      {dark ? <Sun className="h-5 w-5" strokeWidth={1.75} aria-hidden /> : <Moon className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
    </button>
  )
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(0)
  const headerRef = useRef<HTMLElement>(null)
  const menuId = useId()

  useLayoutEffect(() => {
    const el = headerRef.current
    if (!el) return
    const update = () => setHeaderHeight(el.offsetHeight)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [isScrolled, isOpen])

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isOpen])

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const closeMenu = useCallback(() => setIsOpen(false), [])

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-50 w-full transition-[padding,background-color,box-shadow,backdrop-filter,-webkit-backdrop-filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        isOpen
          ? "bg-white py-0 shadow-none !backdrop-blur-none [backdrop-filter:none] [-webkit-backdrop-filter:none] supports-[backdrop-filter]:!bg-white dark:!bg-zinc-950 dark:supports-[backdrop-filter]:!bg-zinc-950 dark:[backdrop-filter:none] dark:[-webkit-backdrop-filter:none]"
          : isScrolled
            ? "bg-white/55 py-0 shadow-none backdrop-blur-sm dark:bg-zinc-950/48 dark:shadow-none dark:backdrop-blur-sm"
            : "bg-white/92 py-0 backdrop-blur-sm dark:bg-zinc-950/42 dark:backdrop-blur-sm dark:supports-[backdrop-filter]:bg-zinc-950/30"
      )}
    >
      <div
        className={cn(
          "box-border grid w-full max-w-none grid-cols-[auto_1fr_auto] items-center gap-x-2 px-8 pt-0 sm:gap-x-4",
          "min-h-[80px] md:grid-cols-[1fr_auto_1fr] md:gap-x-4 lg:gap-x-8"
        )}
      >
        <div className="flex justify-start justify-self-start md:hidden">
          <ThemeToggle
            className={
              isOpen
                ? "!border-stone-200/80 !bg-white !shadow-[0_1px_0_rgba(15,23,42,0.04)] !backdrop-blur-none [backdrop-filter:none] dark:!border-zinc-700/90 dark:!bg-zinc-950 dark:!shadow-[0_1px_0_rgba(0,0,0,0.25)_inset] dark:[backdrop-filter:none]"
                : undefined
            }
          />
        </div>

        <Link
          to="/"
          className={cn(
            "group flex shrink-0 items-center justify-self-center gap-3 rounded-2xl outline-none ring-emerald-700/0 transition-[box-shadow] duration-300",
            "max-md:w-full max-md:justify-center md:justify-self-start",
            "focus-visible:ring-2 focus-visible:ring-emerald-700/35",
            ringOffset
          )}
        >
          <img
            src="/logo.png"
            alt="EcoRide"
            className={cn(
              "block h-[80px] w-[80px] shrink-0 object-contain object-left max-md:object-center",
              "transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            )}
            width={150}
            height={80}
            decoding="async"
          />
          <span
            className={cn(
              "whitespace-nowrap font-sans text-2xl font-extrabold leading-none tracking-tight",
              "rounded-full px-4 py-2",
              "bg-emerald-600/10 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-200",
              "shadow-[0_1px_0_rgba(15,23,42,0.05)] dark:shadow-[0_1px_0_rgba(0,0,0,0.25)_inset]",
              "transition-[transform,background-color,box-shadow] duration-500 ease-out will-change-transform",
              "group-hover:scale-[1.03] group-hover:bg-emerald-600/16 group-hover:shadow-[0_10px_30px_rgba(16,185,129,0.18)]",
              "dark:group-hover:bg-emerald-400/16 dark:group-hover:shadow-[0_10px_30px_rgba(52,211,153,0.12)]",
              "sm:text-3xl"
            )}
          >
            Ecoride
          </span>
        </Link>

        <nav
          aria-label="Navigation principale"
          className="hidden items-center justify-center gap-0.5 md:col-start-2 md:flex md:justify-self-center lg:gap-1"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "group relative rounded-full px-4 py-2.5 text-base font-medium outline-none transition-colors duration-300",
                "text-zinc-600 hover:text-emerald-600 dark:text-zinc-300 dark:hover:text-emerald-400",
                "focus-visible:ring-2 focus-visible:ring-emerald-700/30",
                ringOffset
              )}
            >
              <span className="relative z-10">{item.label}</span>
              <span
                className="pointer-events-none absolute inset-x-3 bottom-2 h-px origin-left scale-x-0 rounded-full bg-gradient-to-r from-emerald-500/0 via-emerald-500/90 to-emerald-600/0 opacity-0 transition-[transform,opacity] duration-300 ease-out group-hover:scale-x-100 group-hover:opacity-100 dark:from-emerald-400/0 dark:via-emerald-400/90 dark:to-emerald-500/0"
                aria-hidden
              />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center justify-end gap-2 justify-self-end lg:gap-3 md:col-start-3 md:flex">
          <Link
            to="/login"
            className={cn(
              "group relative rounded-full px-4 py-2.5 text-base font-medium outline-none",
              "transition-colors duration-200 ease-out",
              "text-zinc-700 hover:text-emerald-600 dark:text-zinc-200 dark:hover:text-emerald-300",
              "focus-visible:ring-2 focus-visible:ring-emerald-700/30",
              ringOffset
            )}
          >
            <span className="relative z-10">Connexion</span>
            <span
              className="pointer-events-none absolute inset-x-3 bottom-2 h-px scale-x-0 rounded-full bg-gradient-to-r from-emerald-500/0 via-emerald-500/90 to-emerald-600/0 opacity-0 transition-[transform,opacity] duration-200 ease-out group-hover:scale-x-100 group-hover:opacity-100 dark:from-emerald-400/0 dark:via-emerald-400/90 dark:to-emerald-500/0"
              aria-hidden
            />
          </Link>
          <a
            href="/recherche"
            className={cn(
              "inline-flex items-center justify-center rounded-full bg-emerald-800 px-5 py-2.5 text-base font-semibold text-white shadow-[0_1px_0_rgba(255,255,255,0.12)_inset] outline-none ring-emerald-900/10 transition-[background-color,transform,box-shadow] duration-300",
              "hover:bg-emerald-900 hover:shadow-[0_1px_0_rgba(255,255,255,0.14)_inset]",
              "focus-visible:ring-2 focus-visible:ring-emerald-700/40",
              ringOffset,
              "active:scale-[0.98]",
              "dark:bg-emerald-700 dark:hover:bg-emerald-600"
            )}
          >
            Trouver un trajet
          </a>
          <ThemeToggle />
        </div>

        <div className="flex justify-end justify-self-end md:hidden">
          <button
            type="button"
            id={`${menuId}-trigger`}
            aria-expanded={isOpen}
            aria-controls={menuId}
            onClick={() => setIsOpen((o) => !o)}
            className={cn(
              "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border outline-none transition-[background-color,border-color,transform,backdrop-filter] duration-300",
              "border-stone-200/80 bg-white/70 text-zinc-800 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-sm",
              "hover:border-stone-300 hover:bg-white",
              "dark:border-zinc-700/90 dark:bg-zinc-900/70 dark:text-zinc-100 dark:shadow-[0_1px_0_rgba(0,0,0,0.25)_inset] dark:hover:border-zinc-600 dark:hover:bg-zinc-800/90",
              isOpen &&
                "!border-stone-200/80 !bg-white !backdrop-blur-none [backdrop-filter:none] dark:!border-zinc-700/90 dark:!bg-zinc-950 dark:[backdrop-filter:none]",
              "focus-visible:ring-2 focus-visible:ring-emerald-700/35",
              ringOffset,
              "active:scale-[0.97]"
            )}
          >
            <span className="sr-only">{isOpen ? "Fermer le menu" : "Ouvrir le menu"}</span>
            {isOpen ? <X className="h-5 w-5" strokeWidth={1.75} aria-hidden /> : <Menu className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
          </button>
        </div>
      </div>

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {isOpen ? (
                <div
                  key="mobile-menu-layer"
                  id={menuId}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={`${menuId}-title`}
                  className="fixed inset-x-0 bottom-0 z-[200] md:hidden"
                  style={{ top: headerHeight }}
                >
                  <button
                    type="button"
                    aria-label="Fermer le menu"
                    className="absolute inset-0 z-0 bg-zinc-950/45 backdrop-blur-sm dark:bg-black/55"
                    onClick={closeMenu}
                  />
                  <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", stiffness: 380, damping: 38, mass: 0.85 }}
                    className="absolute inset-y-0 right-0 z-10 flex h-full w-full max-w-[100vw] flex-col border-l border-stone-200/80 bg-white shadow-[-8px_0_32px_rgba(15,23,42,0.12)] sm:max-w-[20rem] dark:border-zinc-700 dark:bg-zinc-950 dark:shadow-[-8px_0_32px_rgba(0,0,0,0.45)]"
                  >
              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-white px-5 pb-8 pt-6 dark:bg-zinc-950">
                <p id={`${menuId}-title`} className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                  Menu
                </p>
                <nav aria-label="Navigation mobile" className="mt-6 flex flex-1 flex-col gap-1">
                  {NAV.map((item, i) => (
                    <motion.div
                      key={item.href}
                      onClick={closeMenu}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.05, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className={cn(
                        "group flex items-center justify-between rounded-2xl px-3 py-3.5 text-xl font-medium outline-none transition-colors duration-300",
                        "text-zinc-800 hover:bg-white/80 hover:text-emerald-950 dark:text-zinc-100 dark:hover:bg-zinc-800/80 dark:hover:text-emerald-300",
                        "focus-visible:ring-2 focus-visible:ring-emerald-700/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-900"
                      )}
                    >
                      <Link to={item.href} className="flex w-full items-center justify-between" onClick={closeMenu}>
                        <span>{item.label}</span>
                        <span
                          className="text-base font-normal text-zinc-400 transition-transform duration-300 group-hover:translate-x-0.5 dark:text-zinc-500"
                          aria-hidden
                        >
                          →
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </nav>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-auto flex flex-col gap-3 border-t border-stone-200/80 pt-6 dark:border-zinc-700/80"
                >
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className={cn(
                      "flex w-full items-center justify-center rounded-2xl border-0 px-4 py-3.5 text-base font-semibold outline-none transition-colors duration-200",
                      "bg-transparent text-zinc-800 hover:text-emerald-800",
                      "dark:text-zinc-100 dark:hover:text-emerald-200",
                      "focus-visible:ring-2 focus-visible:ring-emerald-700/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-900"
                    )}
                  >
                    Connexion
                  </Link>
                  <a
                    href="/recherche"
                    onClick={closeMenu}
                    className={cn(
                      "flex w-full items-center justify-center rounded-2xl bg-emerald-800 px-4 py-3.5 text-base font-semibold text-white shadow-[0_1px_0_rgba(255,255,255,0.12)_inset] outline-none transition-[background-color,transform] duration-300",
                      "hover:bg-emerald-900 focus-visible:ring-2 focus-visible:ring-emerald-700/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-[0.99] dark:bg-emerald-700 dark:hover:bg-emerald-600 dark:focus-visible:ring-offset-zinc-900"
                    )}
                  >
                    Trouver un trajet
                  </a>
                </motion.div>
              </div>
              <div className="h-1 w-full shrink-0 bg-gradient-to-r from-emerald-700/25 via-emerald-600/40 to-lime-500/20 dark:from-emerald-600/30 dark:via-emerald-500/35 dark:to-lime-500/15" aria-hidden />
                  </motion.div>
                </div>
              ) : null}
            </AnimatePresence>,
            document.body
          )
        : null}
    </header>
  )
}

export default Header
