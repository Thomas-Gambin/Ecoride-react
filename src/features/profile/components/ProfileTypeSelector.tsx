import type { ProfileType } from "@/features/profile/types/profile"
import SoftCard from "@/features/homePage/components/SoftCard"
import { cn } from "@/shared/lib/utils"

const options: Array<{ value: ProfileType; title: string; description: string }> = [
  {
    value: "passenger",
    title: "Passager",
    description: "Je réserve des trajets et voyage avec la communauté.",
  },
  {
    value: "driver",
    title: "Chauffeur",
    description: "Je propose des trajets avec mon véhicule.",
  },
  {
    value: "passenger_driver",
    title: "Passager & chauffeur",
    description: "Je peux réserver et proposer des trajets.",
  },
]

type ProfileTypeSelectorProps = {
  value: ProfileType
  savedValue: ProfileType
  isSaving: boolean
  onChange: (profileType: ProfileType) => void
  onSave: () => void
}

export function ProfileTypeSelector({ value, savedValue, isSaving, onChange, onSave }: ProfileTypeSelectorProps) {
  const hasChanged = value !== savedValue

  return (
    <SoftCard>
      <section className="p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
              Profil
            </p>
            <h2 className="mt-2 text-xl font-bold text-zinc-950 dark:text-zinc-50">Choisir mon usage EcoRide</h2>
          </div>
          <button
            type="button"
            onClick={onSave}
            disabled={!hasChanged || isSaving}
            className="inline-flex cursor-pointer items-center justify-center rounded-2xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-600 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-400"
          >
            {isSaving ? "Sauvegarde…" : "Sauvegarder"}
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {options.map((option) => {
            const active = option.value === value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(option.value)}
                className={cn(
                  "cursor-pointer rounded-3xl border p-4 text-left outline-none transition",
                  "focus-visible:ring-2 focus-visible:ring-emerald-700/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950",
                  active
                    ? "border-emerald-400 bg-emerald-50 text-emerald-950 dark:border-emerald-500/60 dark:bg-emerald-500/10 dark:text-emerald-50"
                    : "border-stone-200 bg-white/60 text-zinc-800 hover:border-emerald-200 hover:bg-emerald-50/50 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-100 dark:hover:border-emerald-700/50 dark:hover:bg-emerald-500/10",
                )}
                aria-pressed={active}
              >
                <span className="block text-base font-bold">{option.title}</span>
                <span className="mt-2 block text-sm text-zinc-600 dark:text-zinc-300">{option.description}</span>
              </button>
            )
          })}
        </div>
      </section>
    </SoftCard>
  )
}
