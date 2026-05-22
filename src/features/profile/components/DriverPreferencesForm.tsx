import { motion } from "framer-motion"
import SoftCard from "@/features/homePage/components/SoftCard"
import type { DriverPreference } from "@/features/profile/types/profile"
import { fadeUp, tapScale } from "@/features/profile/lib/motion"
import { cn } from "@/shared/lib/utils"

type DriverPreferencesFormProps = {
  preferences: DriverPreference
  savedPreferences: DriverPreference
  isSaving: boolean
  onChange: (preferences: Pick<DriverPreference, "allowSmoking" | "allowAnimals">) => void
  onSave: () => void
}

export function DriverPreferencesForm({
  preferences,
  savedPreferences,
  isSaving,
  onChange,
  onSave,
}: DriverPreferencesFormProps) {
  const hasChanged =
    preferences.allowSmoking !== savedPreferences.allowSmoking ||
    preferences.allowAnimals !== savedPreferences.allowAnimals

  return (
    <SoftCard interactive={false}>
      <section className="p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
              Préférences
            </p>
            <h2 className="mt-2 text-xl font-bold text-zinc-950 dark:text-zinc-50">Préférences conducteur</h2>
          </div>
          <motion.button
            type="button"
            onClick={onSave}
            disabled={!hasChanged || isSaving}
            whileTap={hasChanged && !isSaving ? tapScale : undefined}
            className="cursor-pointer rounded-2xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-600 dark:disabled:bg-zinc-800"
          >
            {isSaving ? "Sauvegarde…" : "Enregistrer"}
          </motion.button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <PreferenceToggle
            title="Fumeurs"
            description="Accepter les passagers fumeurs pendant le trajet."
            value={preferences.allowSmoking}
            groupId="smoking"
            onChange={(value) => onChange({ ...preferences, allowSmoking: value })}
          />
          <PreferenceToggle
            title="Animaux"
            description="Accepter les animaux à bord du véhicule."
            value={preferences.allowAnimals}
            groupId="animals"
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
  groupId,
  onChange,
}: {
  title: string
  description: string
  value: boolean
  groupId: string
  onChange: (value: boolean) => void
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="rounded-3xl border border-stone-200 p-4 dark:border-zinc-800"
    >
      <p className="font-bold text-zinc-950 dark:text-zinc-50">{title}</p>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{description}</p>
      <div className="relative mt-4 grid grid-cols-2 gap-2" role="group" aria-label={title}>
        {[true, false].map((option) => {
          const active = value === option
          return (
            <motion.button
              key={String(option)}
              type="button"
              onClick={() => onChange(option)}
              whileTap={tapScale}
              className={cn(
                "relative z-10 cursor-pointer rounded-2xl border px-4 py-2 text-sm font-semibold",
                active
                  ? "border-emerald-400 text-emerald-900 dark:border-emerald-500/60 dark:text-emerald-100"
                  : "border-stone-200 text-zinc-700 dark:border-zinc-800 dark:text-zinc-200",
              )}
              aria-pressed={active}
            >
              {active ? (
                <motion.span
                  layoutId={`preference-pill-${groupId}`}
                  className="absolute inset-0 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  aria-hidden
                />
              ) : null}
              <span className="relative">{option ? "Oui" : "Non"}</span>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
