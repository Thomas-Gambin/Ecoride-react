export type VehicleEnergy = "electric" | "hybrid" | "diesel" | "gasoline"

export type Ride = {
  id: string
  driver: {
    pseudo: string
    avatar: string
    rating: number
  }
  departureCity: string
  arrivalCity: string
  departureDate: string
  departureTime: string
  arrivalTime: string
  durationMinutes: number
  remainingSeats: number
  price: number
  isEco: boolean
  vehicle: {
    brand: string
    model: string
    energy: VehicleEnergy
  }
}

export type RideSearchParams = {
  departure: string
  arrival: string
  date: string
}

export type RideFiltersState = {
  ecoOnly: boolean
  maxPrice: number | null
  maxDurationMinutes: number | null
  minRating: number | null
}

export const DEFAULT_RIDE_FILTERS: RideFiltersState = {
  ecoOnly: false,
  maxPrice: null,
  maxDurationMinutes: null,
  minRating: null,
}
