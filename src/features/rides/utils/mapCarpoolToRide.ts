import type { CarpoolMockRecord } from "../types/carpool"
import type { Ride, VehicleEnergy } from "../types/ride"

function mapEnergyToRide(energy: CarpoolMockRecord["car"]["energy"]): VehicleEnergy {
  switch (energy) {
    case "electrique":
      return "electric"
    case "hybride":
      return "hybrid"
    case "diesel":
      return "diesel"
    case "essence":
    default:
      return "gasoline"
  }
}

function isEcoVehicle(energy: CarpoolMockRecord["car"]["energy"]): boolean {
  return energy === "electrique" || energy === "hybride"
}

function avatarForUsername(username: string): string {
  return `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(username)}`
}

/**
 * Transforme un enregistrement aligné BDD en modèle d’affichage `Ride`.
 * Prévu pour être réutilisé par `mapRideFromApi()` lors du branchement Symfony.
 */
export function mapCarpoolToRide(record: CarpoolMockRecord): Ride {
  const remainingSeats = Math.max(0, record.seatCount - record.bookedPassengerCount)

  return {
    id: String(record.id),
    driver: {
      pseudo: record.driver.username,
      avatar: avatarForUsername(record.driver.username),
      rating: record.driver.averageRating,
    },
    departureCity: record.departureLocation,
    arrivalCity: record.arrivalLocation,
    departureDate: record.departureDate,
    departureTime: record.departureTime,
    arrivalTime: record.arrivalTime,
    durationMinutes: record.durationMinutes,
    remainingSeats,
    price: Math.round(record.pricePerPerson),
    isEco: isEcoVehicle(record.car.energy),
    vehicle: {
      brand: record.car.brandLabel,
      model: record.car.model,
      energy: mapEnergyToRide(record.car.energy),
    },
  }
}

/** Exclut les trajets non réservables (statut ou places). */
export function isCarpoolSearchable(record: CarpoolMockRecord): boolean {
  if (record.status !== "open") return false
  const remaining = record.seatCount - record.bookedPassengerCount
  return remaining >= 1
}
