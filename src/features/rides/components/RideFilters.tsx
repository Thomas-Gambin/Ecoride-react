import SoftCard from "@/features/homePage/components/SoftCard"
import { cn } from "@/shared/lib/utils"
import type { RideFiltersState } from "../types/ride"

type RideFiltersProps = {
  filters: RideFiltersState
  onChange: (filters: RideFiltersState) => void
  className?: string
}

function parseOptionalNumber(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : null
}

const inputClass = cn(
  "mt-1.5 w-full rounded-xl border border-stone-200/80 bg-white/90 px-3 py-2 text-sm text-zinc-900 outline-none",
  "focus-visible:ring-2 focus-visible:ring-emerald-700/30",
  "dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-50"
)

export function RideFilters({ filters, onChange, className }: RideFiltersProps) {
  return (
    <SoftCard interactive={false} className={className}>
      <aside className="p-5" aria-label="Filtres des trajets">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
          Filtres
        </p>
        <h2 className="mt-2 text-lg font-bold text-zinc-950 dark:text-zinc-50">Affiner les résultats</h2>

        <div className="mt-5 space-y-4">
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-stone-200/70 px-3 py-3 dark:border-zinc-700/80">
            <input
              type="checkbox"
              checked={filters.ecoOnly}
              onChange={(e) => onChange({ ...filters, ecoOnly: e.target.checked })}
              className="mt-0.5 h-4 w-4 rounded border-stone-300 text-emerald-700 focus:ring-emerald-600"
            />
            <span>
              <span className="block text-sm font-semibold text-zinc-900 dark:text-zinc-50">Voyage écologique</span>
              <span className="mt-0.5 block text-xs text-zinc-500 dark:text-zinc-400">Véhicule électrique ou hybride</span>
            </span>
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
              Prix maximum (crédits)
            </span>
            <input
              type="number"
              min={0}
              step={1}
              value={filters.maxPrice ?? ""}
              onChange={(e) => onChange({ ...filters, maxPrice: parseOptionalNumber(e.target.value) })}
              placeholder="Ex. 25"
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
              Durée maximum (minutes)
            </span>
            <input
              type="number"
              min={0}
              step={5}
              value={filters.maxDurationMinutes ?? ""}
              onChange={(e) => onChange({ ...filters, maxDurationMinutes: parseOptionalNumber(e.target.value) })}
              placeholder="Ex. 180"
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
              Note minimale du chauffeur
            </span>
            <input
              type="number"
              min={0}
              max={5}
              step={0.1}
              value={filters.minRating ?? ""}
              onChange={(e) => onChange({ ...filters, minRating: parseOptionalNumber(e.target.value) })}
              placeholder="Ex. 4.5"
              className={inputClass}
            />
          </label>
        </div>
      </aside>
    </SoftCard>
  )
}
