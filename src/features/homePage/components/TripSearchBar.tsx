import { useMemo, useState, type ReactNode } from "react"
import { ArrowRight, Calendar, MapPin, Search } from "lucide-react"
import { cn } from "@/shared/lib/utils"

type TripSearchValues = {
  from: string
  to: string
  date: string
}

const ringOffset =
  "focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950"

function FieldShell({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "group relative flex min-h-[54px] items-center gap-3 rounded-2xl border px-4 py-3",
        "border-stone-200/80 bg-white/80 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-sm",
        "transition-[border-color,background-color,box-shadow] duration-300",
        "hover:border-stone-300 hover:bg-white",
        "dark:border-zinc-700/80 dark:bg-zinc-900/55 dark:shadow-[0_1px_0_rgba(0,0,0,0.22)_inset] dark:hover:border-zinc-600 dark:hover:bg-zinc-900/70",
        "focus-within:ring-2 focus-within:ring-emerald-700/25",
        className
      )}
    >
      {children}
    </div>
  )
}

function Label({ children }: { children: string }) {
  return (
    <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
      {children}
    </span>
  )
}

export default function TripSearchBar({
  className,
  onSubmit,
}: {
  className?: string
  onSubmit?: (values: TripSearchValues) => void
}) {
  const [values, setValues] = useState<TripSearchValues>({ from: "", to: "", date: "" })

  const isReady = useMemo(() => {
    const okFrom = values.from.trim().length > 0
    const okTo = values.to.trim().length > 0
    return okFrom && okTo
  }, [values.from, values.to])

  return (
    <form
      className={cn(
        "relative w-full rounded-[28px] border bg-white/78 p-3 shadow-[0_18px_55px_rgba(15,23,42,0.12)] backdrop-blur-md",
        "border-stone-200/70",
        "dark:border-zinc-700/70 dark:bg-zinc-950/40 dark:shadow-[0_18px_55px_rgba(0,0,0,0.45)]",
        className
      )}
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit?.(values)
      }}
      aria-label="Recherche de trajet"
    >
      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-[1fr_auto_1fr_1fr_auto] md:items-stretch md:gap-3">
        <FieldShell className="md:rounded-[26px]">
          <MapPin className="h-5 w-5 text-emerald-700/75 dark:text-emerald-300/80" strokeWidth={1.8} aria-hidden />
          <div className="min-w-0 flex-1">
            <label className="block">
              <Label>Départ</Label>
              <input
                value={values.from}
                onChange={(e) => setValues((v) => ({ ...v, from: e.target.value }))}
                placeholder="Ville, adresse…"
                autoComplete="address-level2"
                className={cn(
                  "mt-1 w-full bg-transparent text-[15px] font-medium text-zinc-900 outline-none placeholder:text-zinc-400",
                  "dark:text-zinc-50 dark:placeholder:text-zinc-500"
                )}
              />
            </label>
          </div>
        </FieldShell>

        <div className="hidden md:flex md:items-center md:justify-center">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-stone-200/70 bg-white/70 text-zinc-500 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-sm dark:border-zinc-700/70 dark:bg-zinc-900/55 dark:text-zinc-400">
            <ArrowRight className="h-5 w-5" strokeWidth={1.7} aria-hidden />
          </div>
        </div>

        <FieldShell className="md:rounded-[26px]">
          <MapPin className="h-5 w-5 text-emerald-700/75 dark:text-emerald-300/80" strokeWidth={1.8} aria-hidden />
          <div className="min-w-0 flex-1">
            <label className="block">
              <Label>Arrivée</Label>
              <input
                value={values.to}
                onChange={(e) => setValues((v) => ({ ...v, to: e.target.value }))}
                placeholder="Ville, adresse…"
                autoComplete="address-level2"
                className={cn(
                  "mt-1 w-full bg-transparent text-[15px] font-medium text-zinc-900 outline-none placeholder:text-zinc-400",
                  "dark:text-zinc-50 dark:placeholder:text-zinc-500"
                )}
              />
            </label>
          </div>
        </FieldShell>

        <FieldShell className="md:rounded-[26px]">
          <Calendar className="h-5 w-5 text-emerald-700/70 dark:text-emerald-300/80" strokeWidth={1.8} aria-hidden />
          <div className="min-w-0 flex-1">
            <label className="block">
              <Label>Date</Label>
              <input
                value={values.date}
                onChange={(e) => setValues((v) => ({ ...v, date: e.target.value }))}
                type="date"
                className={cn(
                  "mt-1 w-full bg-transparent text-[15px] font-medium text-zinc-900 outline-none",
                  "dark:text-zinc-50",
                  ringOffset
                )}
              />
            </label>
          </div>
        </FieldShell>

        <button
          type="submit"
          disabled={!isReady}
          className={cn(
            "group relative inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl px-5 text-[15px] font-semibold outline-none",
            "bg-emerald-800 text-white shadow-[0_1px_0_rgba(255,255,255,0.12)_inset]",
            "transition-[transform,box-shadow,background-color] duration-300",
            "hover:bg-emerald-900 hover:shadow-[0_1px_0_rgba(255,255,255,0.14)_inset]",
            "active:scale-[0.99]",
            "focus-visible:ring-2 focus-visible:ring-emerald-700/40",
            ringOffset,
            "dark:bg-emerald-700 dark:hover:bg-emerald-600",
            "disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:bg-emerald-800 dark:disabled:hover:bg-emerald-700"
          )}
        >
          <Search className="h-5 w-5 opacity-90 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={1.85} aria-hidden />
          Rechercher
        </button>
      </div>

      <p className="px-2 pt-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
        Renseigne ton départ et ton arrivée pour découvrir les trajets disponibles. (Recherche désactivée pour le moment.)
      </p>
    </form>
  )
}

