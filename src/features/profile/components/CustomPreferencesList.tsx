import { useState, type FormEvent } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import SoftCard from "@/features/homePage/components/SoftCard"
import type { CustomPreference } from "@/features/profile/types/profile"
import { scaleIn, tapScale } from "@/features/profile/lib/motion"

type CustomPreferencesListProps = {
  preferences: CustomPreference[]
  isSaving: boolean
  onAdd: (label: string) => void
  onDelete: (id: number) => void
}

export function CustomPreferencesList({ preferences, isSaving, onAdd, onDelete }: CustomPreferencesListProps) {
  const [label, setLabel] = useState("")
  const [error, setError] = useState<string | null>(null)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = label.trim()
    if (!value) {
      setError("La préférence est obligatoire.")
      return
    }

    if (preferences.some((preference) => preference.label.toLowerCase() === value.toLowerCase())) {
      setError("Cette préférence existe déjà.")
      return
    }

    setError(null)
    onAdd(value)
    setLabel("")
  }

  return (
    <SoftCard interactive={false}>
      <section className="p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
          Préférences libres
        </p>
        <h2 className="mt-2 text-xl font-bold text-zinc-950 dark:text-zinc-50">Ajouter mes règles à bord</h2>

        <form onSubmit={submit} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <label className="flex-1">
            <span className="sr-only">Préférence personnalisée</span>
            <input
              value={label}
              onChange={(event) => {
                setLabel(event.target.value)
                setError(null)
              }}
              placeholder="Ex. Musique calme uniquement"
              className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-emerald-700/25 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
            />
          </label>
          <motion.button
            type="submit"
            disabled={isSaving}
            whileTap={!isSaving ? tapScale : undefined}
            className="cursor-pointer rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-600 dark:disabled:bg-zinc-800"
          >
            Ajouter
          </motion.button>
        </form>
        <AnimatePresence mode="popLayout">
          {error ? (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-2 text-sm text-rose-700 dark:text-rose-200"
            >
              {error}
            </motion.p>
          ) : null}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {preferences.length === 0 ? (
            <motion.p
              key="empty-custom"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-5 rounded-3xl border border-dashed border-stone-300 p-5 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-300"
            >
              Aucune préférence personnalisée pour le moment.
            </motion.p>
          ) : (
            <motion.ul
              key="custom-list"
              layout
              className="mt-5 flex flex-wrap gap-2"
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence mode="popLayout">
                {preferences.map((preference) => (
                  <motion.li
                    key={preference.id}
                    layout
                    variants={scaleIn}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-950 dark:border-emerald-700/50 dark:bg-emerald-500/10 dark:text-emerald-100"
                  >
                    {preference.label}
                    <motion.button
                      type="button"
                      onClick={() => onDelete(preference.id)}
                      disabled={isSaving}
                      whileTap={!isSaving ? { scale: 0.85 } : undefined}
                      className="cursor-pointer rounded-full p-0.5 text-emerald-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-emerald-100"
                      aria-label={`Supprimer ${preference.label}`}
                    >
                      <X className="h-3.5 w-3.5" aria-hidden />
                    </motion.button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          )}
        </AnimatePresence>
      </section>
    </SoftCard>
  )
}
