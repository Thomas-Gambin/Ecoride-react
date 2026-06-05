import type { Ride, RideFiltersState } from "../types/ride"
import { hasAvailableSeats } from "./searchRides"

export function filterRides(rides: Ride[], filters: RideFiltersState): Ride[] {
  return rides.filter((ride) => {
    if (!hasAvailableSeats(ride)) return false
    if (filters.ecoOnly && !ride.isEco) return false
    if (filters.maxPrice !== null && ride.price > filters.maxPrice) return false
    if (filters.maxDurationMinutes !== null && ride.durationMinutes > filters.maxDurationMinutes) return false
    if (filters.minRating !== null && ride.driver.rating < filters.minRating) return false
    return true
  })
}
