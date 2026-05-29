import { Link } from "react-router-dom"
import { ArrowRight, Clock, Leaf, Star, Users } from "lucide-react"
import SoftCard from "@/features/homePage/components/SoftCard"
import { cn } from "@/shared/lib/utils"
import type { Ride } from "../types/ride"
import { formatDuration, formatPrice, formatRating, formatRideDate } from "../utils/formatRide"

type RideCardProps = {
  ride: Ride
}

export function RideCard({ ride }: RideCardProps) {
  const fewSeatsLeft = ride.remainingSeats <= 1

  return (
    <SoftCard interactive={false}>
      <article className="flex flex-col gap-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={ride.driver.avatar}
              alt=""
              className="h-12 w-12 shrink-0 rounded-full border border-stone-200/80 bg-white object-cover dark:border-zinc-700"
            />
            <div className="min-w-0">
              <p className="truncate text-base font-bold text-zinc-950 dark:text-zinc-50">{ride.driver.pseudo}</p>
              <p className="mt-0.5 inline-flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-300">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
                <span className="font-semibold text-zinc-800 dark:text-zinc-100">{formatRating(ride.driver.rating)}</span>
                <span className="text-zinc-500 dark:text-zinc-400">/ 5</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {ride.isEco ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
                <Leaf className="h-3.5 w-3.5" aria-hidden />
                Écologique
              </span>
            ) : null}
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              {ride.vehicle.brand} {ride.vehicle.model}
            </span>
          </div>
        </div>

        <div>
          <p className="flex flex-wrap items-center gap-2 text-lg font-bold text-zinc-950 dark:text-zinc-50">
            <span>{ride.departureCity}</span>
            <ArrowRight className="h-4 w-4 text-emerald-700 dark:text-emerald-300" aria-hidden />
            <span>{ride.arrivalCity}</span>
          </p>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{formatRideDate(ride.departureDate)}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-stone-200/70 bg-white/60 px-3 py-2.5 dark:border-zinc-700/80 dark:bg-zinc-900/40">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">Départ</p>
            <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">{ride.departureTime}</p>
          </div>
          <div className="rounded-2xl border border-stone-200/70 bg-white/60 px-3 py-2.5 dark:border-zinc-700/80 dark:bg-zinc-900/40">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">Arrivée</p>
            <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">{ride.arrivalTime}</p>
          </div>
          <div className="rounded-2xl border border-stone-200/70 bg-white/60 px-3 py-2.5 dark:border-zinc-700/80 dark:bg-zinc-900/40">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">Durée</p>
            <p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              <Clock className="h-4 w-4 text-emerald-700 dark:text-emerald-300" aria-hidden />
              {formatDuration(ride.durationMinutes)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-3 border-t border-stone-200/70 pt-4 dark:border-zinc-700/80">
          <div className="space-y-1">
            <p
              className={cn(
                "inline-flex items-center gap-1 text-sm font-medium",
                fewSeatsLeft ? "text-amber-700 dark:text-amber-300" : "text-zinc-600 dark:text-zinc-300"
              )}
            >
              <Users className="h-4 w-4" aria-hidden />
              {ride.remainingSeats} place{ride.remainingSeats > 1 ? "s" : ""} restante{ride.remainingSeats > 1 ? "s" : ""}
            </p>
            <p className="text-base font-bold text-emerald-800 dark:text-emerald-300">{formatPrice(ride.price)}</p>
          </div>

          <Link
            to={`/covoiturages/${ride.id}`}
            className={cn(
              "inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold",
              "bg-emerald-800 text-white transition-colors hover:bg-emerald-900",
              "dark:bg-emerald-700 dark:hover:bg-emerald-600"
            )}
          >
            Détail
          </Link>
        </div>
      </article>
    </SoftCard>
  )
}
