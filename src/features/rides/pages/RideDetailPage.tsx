import { Link, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export default function RideDetailPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14">
      <Link
        to="/covoiturages"
        className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 transition-colors hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-200"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Retour aux covoiturages
      </Link>

      <h1 className="mt-6 text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">Détail du trajet</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
        Fiche trajet à venir{id ? ` (identifiant : ${id})` : ""}.
      </p>
    </main>
  )
}
