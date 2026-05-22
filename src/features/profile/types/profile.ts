import type { AuthUser, ProfileType } from "@/features/auth/types/user"

export type { ProfileType }

export const CAR_ENERGY_OPTIONS = [
  { value: "essence", label: "Essence" },
  { value: "diesel", label: "Diesel" },
  { value: "hybride", label: "Hybride" },
  { value: "electrique", label: "Électrique" },
] as const

export type Vehicle = {
  id: number
  registrationNumber: string
  firstRegistrationDate: string
  brand: string
  brandId?: number
  model: string
  color: string
  energy: string
}

export type VehiclePayload = {
  registrationNumber: string
  firstRegistrationDate: string
  brand: string
  model: string
  color: string
  energy: string
}

export type CustomPreference = {
  id: number
  label: string
  createdAt?: string
}

export type DriverPreference = {
  id?: number
  allowSmoking: boolean
  allowAnimals: boolean
  customPreferences: CustomPreference[]
}

export type MeResponse = {
  user: AuthUser
}

export type VehiclesResponse = {
  vehicles: Vehicle[]
}

export type VehicleResponse = {
  message: string
  vehicle: Vehicle
}

export type PreferencesResponse = {
  message?: string
  preferences: DriverPreference
}

export type CustomPreferenceResponse = PreferencesResponse & {
  customPreference: CustomPreference
}
