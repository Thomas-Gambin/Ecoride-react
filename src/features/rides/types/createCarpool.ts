export type CommuneSelection = {
  name: string
  code: string
  postalCode: string
  postalCodes?: string[]
}

export const PLATFORM_FEE_CREDITS = 2

export type CityPayload = {
  name: string
  code: string
  postalCode: string
}

export type CarpoolStatus = "open" | "full" | "completed" | "cancelled"

export type CarpoolRecord = {
  id: number
  departureDate: string
  departureTime: string
  departureLocation: string
  departureCityCode: string
  departurePostalCode: string
  arrivalDate: string
  arrivalTime: string
  arrivalLocation: string
  arrivalCityCode: string
  arrivalPostalCode: string
  status: CarpoolStatus
  seatCount: number
  pricePerPerson: number
  platformFeeCredits: number
  vehicleId: number | null
  bookedPassengerCount: number
  durationMinutes: number
  car: {
    brandLabel: string
    model: string
    energy: string
    color: string
  }
}

export type CarpoolFormInitialValues = {
  departureCity: CommuneSelection
  arrivalCity: CommuneSelection
  departureDate: string
  departureTime: string
  arrivalTime: string
  priceCredits: number
  seatCount: number
  vehicleId: number
}

export type CreateCarpoolPayload = {
  departureCity: CityPayload
  arrivalCity: CityPayload
  departureDate: string
  departureTime: string
  arrivalTime: string
  priceCredits: number
  seatCount: number
  vehicleId?: number
  newVehicle?: {
    registrationNumber: string
    firstRegistrationDate: string
    brand: string
    model: string
    color: string
    energy: string
  }
}

export type UpdateCarpoolPayload = {
  departureCity: CityPayload
  arrivalCity: CityPayload
  departureDate: string
  departureTime: string
  arrivalTime: string
  priceCredits: number
  seatCount: number
  vehicleId: number
}

export type CreateCarpoolResponse = {
  message: string
  carpool: CarpoolRecord
}

export type MyCarpoolsResponse = {
  carpools: CarpoolRecord[]
}

export function carpoolToFormInitialValues(carpool: CarpoolRecord): CarpoolFormInitialValues {
  return {
    departureCity: {
      name: carpool.departureLocation,
      code: carpool.departureCityCode,
      postalCode: carpool.departurePostalCode,
    },
    arrivalCity: {
      name: carpool.arrivalLocation,
      code: carpool.arrivalCityCode,
      postalCode: carpool.arrivalPostalCode,
    },
    departureDate: carpool.departureDate,
    departureTime: carpool.departureTime,
    arrivalTime: carpool.arrivalTime,
    priceCredits: carpool.pricePerPerson,
    seatCount: carpool.seatCount,
    vehicleId: carpool.vehicleId ?? 0,
  }
}

export function isCarpoolEditable(carpool: CarpoolRecord): boolean {
  return carpool.status === "open" && carpool.bookedPassengerCount === 0
}
