import SoftCard from "@/features/homePage/components/SoftCard"
import type { DriverPreference } from "@/features/profile/types/profile"
import { cn } from "@/shared/lib/utils"

type DriverPreferencesFormProps = {
  preferences: DriverPreference
  isSaving: boolean
  onChange: (preferences: Pick<DriverPreference, "allowSmoking" | "allowAnimals">) => void
  onSave: () => void
}

export function DriverPreferencesForm({ preferences, isSaving, onChange, onSave }: DriverPreferencesFormProps) {
  return (
    <SoftCard>
      <section className="p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
              Préférences
            </p>
            <h2 className="mt-2 text-xl font-bold text-zinc-950 dark:text-zinc-50">Préférences conducteur</h2>
          </div>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="cursor-pointer rounded-2xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-600 dark:disabled:bg-zinc-800"
          >
            {isSaving ? "Sauvegarde…" : "Enregistrer"}
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <PreferenceToggle
            title="Fumeurs"
            description="Accepter les passagers fumeurs pendant le trajet."
            value={preferences.allowSmoking}
            onChange={(value) => onChange({ ...preferences, allowSmoking: value })}
          />
          <PreferenceToggle
            title="Animaux"
            description="Accepter les animaux à bord du véhicule."
            value={preferences.allowAnimals}
            onChange={(value) => onChange({ ...preferences, allowAnimals: value })}
          />
        </div>
      </section>
    </SoftCard>
  )
}

function PreferenceToggle({
  title,
  description,
  value,
  onChange,
}: {
  title: string
  description: string
  value: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="rounded-3xl border border-stone-200 bg-white/60 p-4 dark:border-zinc-800 dark:bg-zinc-950/30">
      <p className="font-bold text-zinc-950 dark:text-zinc-50">{title}</p>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{description}</p>
      <div className="mt-4 grid grid-cols-2 gap-2" role="group" aria-label={title}>
        {[true, false].map((option) => (
          <button
            key={String(option)}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "cursor-pointer rounded-2xl border px-4 py-2 text-sm font-semibold transition",
              value === option
                ? "border-emerald-400 bg-emerald-50 text-emerald-900 dark:border-emerald-500/60 dark:bg-emerald-500/10 dark:text-emerald-100"
                : "border-stone-200 text-zinc-700 hover:bg-stone-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900",
            )}
            aria-pressed={value === option}
          >
            {option ? "Oui" : "Non"}
          </button>
        ))}
      </div>
    </div>
  )
}
