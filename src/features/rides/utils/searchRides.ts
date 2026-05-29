// TODO: remplacer par appel API GET /api/rides?departure=&arrival=&date=

import type { Ride, RideSearchParams } from "../types/ride"
import { matchesCity } from "./normalizeSearchText"

export function hasAvailableSeats(ride: Ride): boolean {
  return ride.remainingSeats >= 1
}

export function hasActiveSearchParams(params: RideSearchParams): boolean {
  return params.departure.trim().length > 0 || params.arrival.trim().length > 0 || params.date.trim().length > 0
}

/** Filtre par critères de recherche ; champs vides = ignorés (tous les trajets conservés). */
export function searchRides(rides: Ride[], params: RideSearchParams): Ride[] {
  const departure = params.departure.trim()
  const arrival = params.arrival.trim()
  const date = params.date.trim()

  return rides.filter((ride) => {
    if (!hasAvailableSeats(ride)) return false
    if (date && ride.departureDate !== date) return false
    if (departure && !matchesCity(departure, ride.departureCity)) return false
    if (arrival && !matchesCity(arrival, ride.arrivalCity)) return false
    return true
  })
}
