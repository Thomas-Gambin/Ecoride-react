import { useState, type FormEvent } from "react"
import { X } from "lucide-react"
import SoftCard from "@/features/homePage/components/SoftCard"
import type { CustomPreference } from "@/features/profile/types/profile"

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
    <SoftCard>
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
              className="w-full rounded-2xl border border-stone-200 bg-white/80 px-4 py-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-emerald-700/25 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-50"
            />
          </label>
          <button
            type="submit"
            disabled={isSaving}
            className="cursor-pointer rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-600 dark:disabled:bg-zinc-800"
          >
            Ajouter
          </button>
        </form>
        {error ? <p className="mt-2 text-sm text-rose-700 dark:text-rose-200">{error}</p> : null}

        {preferences.length === 0 ? (
          <p className="mt-5 rounded-3xl border border-dashed border-stone-300 p-5 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-300">
            Aucune préférence personnalisée pour le moment.
          </p>
        ) : (
          <ul className="mt-5 flex flex-wrap gap-2">
            {preferences.map((preference) => (
              <li
                key={preference.id}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-950 dark:border-emerald-700/50 dark:bg-emerald-500/10 dark:text-emerald-100"
              >
                {preference.label}
                <button
                  type="button"
                  onClick={() => onDelete(preference.id)}
                  disabled={isSaving}
                  className="cursor-pointer rounded-full p-0.5 text-emerald-900 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-emerald-100 dark:hover:bg-emerald-500/20"
                  aria-label={`Supprimer ${preference.label}`}
                >
                  <X className="h-3.5 w-3.5" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </SoftCard>
  )
}
