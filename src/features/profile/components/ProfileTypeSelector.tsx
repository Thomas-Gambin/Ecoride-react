import { AnimatePresence, motion } from "framer-motion"
import { profileTypeLabel } from "@/features/profile/lib/profileType"
import type { ProfileType } from "@/features/profile/types/profile"
import SoftCard from "@/features/homePage/components/SoftCard"
import { fadeUp, staggerItems, tapScale } from "@/features/profile/lib/motion"
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
    <SoftCard interactive={false}>
      <section className="relative p-6">
        <AnimatePresence>
          {hasChanged ? (
            <motion.span
              key="saved-profile-badge"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-6 top-6 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900 dark:border-emerald-700/50 dark:bg-emerald-500/10 dark:text-emerald-100"
            >
              Enregistré : {profileTypeLabel(savedValue)}
            </motion.span>
          ) : null}
        </AnimatePresence>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
              Profil
            </p>
            <h2 className="mt-2 text-xl font-bold text-zinc-950 dark:text-zinc-50">Choisir mon usage EcoRide</h2>
          </div>
          <motion.button
            type="button"
            onClick={onSave}
            disabled={!hasChanged || isSaving}
            whileTap={hasChanged && !isSaving ? tapScale : undefined}
            className="inline-flex cursor-pointer items-center justify-center rounded-2xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-600 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-400"
          >
            {isSaving ? "Sauvegarde…" : "Sauvegarder"}
          </motion.button>
        </div>

        <motion.div
          className="mt-5 grid gap-3 md:grid-cols-3"
          variants={staggerItems}
          initial="hidden"
          animate="visible"
        >
          {options.map((option) => {
            const active = option.value === value
            return (
              <motion.button
                key={option.value}
                type="button"
                variants={fadeUp}
                layout
                onClick={() => onChange(option.value)}
                whileTap={tapScale}
                transition={{ layout: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }}
                className={cn(
                  "relative cursor-pointer overflow-hidden rounded-3xl border p-4 text-left outline-none",
                  "focus-visible:ring-2 focus-visible:ring-emerald-700/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950",
                  active
                    ? "border-emerald-400 bg-emerald-50 text-emerald-950 dark:border-emerald-500/60 dark:bg-emerald-500/10 dark:text-emerald-50"
                    : "border-stone-200 text-zinc-800 dark:border-zinc-800 dark:text-zinc-100",
                )}
                aria-pressed={active}
              >
                {active ? (
                  <motion.span
                    layoutId="profile-type-active-ring"
                    className="pointer-events-none absolute inset-0 rounded-3xl ring-2 ring-emerald-500/40 ring-offset-2 ring-offset-emerald-50 dark:ring-emerald-400/35 dark:ring-offset-emerald-500/10"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    aria-hidden
                  />
                ) : null}
                <span className="relative block text-base font-bold">{option.title}</span>
                <span className="relative mt-2 block text-sm text-zinc-600 dark:text-zinc-300">{option.description}</span>
              </motion.button>
            )
          })}
        </motion.div>
      </section>
    </SoftCard>
  )
}
