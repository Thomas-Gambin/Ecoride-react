import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight, Clock, MapPin, Pencil, Trash2 } from "lucide-react"
import { deleteCarpool, getMyCarpools } from "@/features/rides/api/carpools"
import { DriverRequiredMessage } from "@/features/rides/components/CreateCarpoolForm"
import { fadeUp, staggerItems } from "@/features/profile/lib/motion"
import type { ProfileType } from "@/features/auth/types/user"
import type { CarpoolRecord } from "@/features/rides/types/createCarpool"
import { isCarpoolEditable } from "@/features/rides/types/createCarpool"
import SoftCard from "@/features/homePage/components/SoftCard"
import type { ApiErrorShape } from "@/shared/api/client"
import { useAuth } from "@/shared/hooks/useAuth"
import { toast } from "@/shared/lib/toast"
import { cn } from "@/shared/lib/utils"

const isDriverProfile = (profileType: ProfileType) => profileType === "driver" || profileType === "passenger_driver"

const STATUS_LABELS: Record<CarpoolRecord["status"], string> = {
  open: "Ouvert",
  full: "Complet",
  completed: "Terminé",
  cancelled: "Annulé",
}

function parseApiError(error: unknown): ApiErrorShape {
  if (error instanceof Error) {
    try {
      return JSON.parse(error.message) as ApiErrorShape
    } catch {
      return { message: error.message }
    }
  }

  return { message: "Une erreur est survenue." }
}

function formatTripDate(date: string, time: string): string {
  const value = new Date(`${date}T${time}`)
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value)
}

function MyTripCard({
  carpool,
  onDelete,
  isDeleting,
}: {
  carpool: CarpoolRecord
  onDelete: (id: number) => void
  isDeleting: boolean
}) {
  const editable = isCarpoolEditable(carpool)

  return (
    <SoftCard interactive={false} className="p-5 md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold",
                carpool.status === "open"
                  ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-100"
                  : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
              )}
            >
              {STATUS_LABELS[carpool.status]}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {carpool.seatCount} place{carpool.seatCount > 1 ? "s" : ""} · {carpool.pricePerPerson} crédits
            </span>
          </div>

          <div className="space-y-2">
            <p className="inline-flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-200">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-300" aria-hidden />
              <span>
                {carpool.departureLocation} → {carpool.arrivalLocation}
              </span>
            </p>
            <p className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
              <Clock className="h-4 w-4 shrink-0" aria-hidden />
              {formatTripDate(carpool.departureDate, carpool.departureTime)}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {carpool.car.brandLabel} {carpool.car.model} · {carpool.car.color}
            </p>
          </div>

          {!editable ? (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {carpool.bookedPassengerCount > 0
                ? "Ce trajet a des passagers inscrits et ne peut plus être modifié."
                : "Ce trajet ne peut plus être modifié."}
            </p>
          ) : null}
        </div>

        {editable ? (
          <div className="flex flex-wrap gap-2">
            <Link
              to={`/trajets/${carpool.id}/modifier`}
              className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              <Pencil className="h-4 w-4" aria-hidden />
              Modifier
            </Link>
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => onDelete(carpool.id)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed dark:border-rose-500/30 dark:text-rose-200 dark:hover:bg-rose-500/10"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
              {isDeleting ? "Suppression…" : "Supprimer"}
            </button>
          </div>
        ) : null}
      </div>
    </SoftCard>
  )
}

export default function MyTripsPage() {
  const { user } = useAuth()
  const [carpools, setCarpools] = useState<CarpoolRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const loadTrips = async () => {
    setIsLoading(true)
    try {
      const response = await getMyCarpools()
      setCarpools(response.carpools)
    } catch (error) {
      const apiError = parseApiError(error)
      toast.error(apiError.message ?? "Impossible de charger vos trajets.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user && isDriverProfile(user.profileType)) {
      void loadTrips()
    } else {
      setIsLoading(false)
    }
  }, [user])

  const handleDelete = async (id: number) => {
    if (!window.confirm("Supprimer ce trajet ? Cette action est définitive.")) return

    setDeletingId(id)
    try {
      await deleteCarpool(id)
      setCarpools((current) => current.filter((trip) => trip.id !== id))
      toast.success("Votre trajet a bien été supprimé.")
    } catch (error) {
      const apiError = parseApiError(error)
      toast.error(apiError.message ?? "Impossible de supprimer le trajet.")
    } finally {
      setDeletingId(null)
    }
  }

  if (!user) return null

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14">
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">EcoRide</p>
          <h1 className="mt-2 text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">Mes trajets</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-300">
            Retrouvez les covoiturages que vous avez proposés et gérez-les tant qu’ils sont encore ouverts.
          </p>
        </div>
        {isDriverProfile(user.profileType) ? (
          <Link
            to="/trajets/creer"
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Créer un trajet
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        ) : null}
      </motion.div>

      {!isDriverProfile(user.profileType) ? (
        <DriverRequiredMessage />
      ) : isLoading ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-300">Chargement…</p>
      ) : carpools.length === 0 ? (
        <SoftCard interactive={false} className="space-y-4 p-8 text-center">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Aucun trajet pour le moment</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">Proposez votre premier covoiturage pour le retrouver ici.</p>
          <Link
            to="/trajets/creer"
            className="inline-flex rounded-2xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Créer un trajet
          </Link>
        </SoftCard>
      ) : (
        <motion.div className="space-y-4" variants={staggerItems} initial="hidden" animate="visible">
          {carpools.map((carpool) => (
            <motion.div key={carpool.id} variants={fadeUp}>
              <MyTripCard carpool={carpool} onDelete={handleDelete} isDeleting={deletingId === carpool.id} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </main>
  )
}
