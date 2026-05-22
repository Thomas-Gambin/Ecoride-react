import { deleteJson, getJson, postJson, putJson } from "@/shared/api/client"
import type { AuthUser } from "@/features/auth/types/user"
import type {
  CustomPreferenceResponse,
  DriverPreference,
  MeResponse,
  PreferencesResponse,
  ProfileType,
  VehiclePayload,
  VehicleResponse,
  VehiclesResponse,
} from "../types/profile"

export function getProfile() {
  return getJson<MeResponse>("/api/profile")
}

export function updateProfileRole(role: ProfileType) {
  return putJson<{ message: string; user: AuthUser }, { role: ProfileType }>("/api/profile/role", { role })
}

export function getVehicles() {
  return getJson<VehiclesResponse>("/api/vehicles")
}

export function createVehicle(payload: VehiclePayload) {
  return postJson<VehicleResponse, VehiclePayload>("/api/vehicles", payload)
}

export function updateVehicle(id: number, payload: VehiclePayload) {
  return putJson<VehicleResponse, VehiclePayload>(`/api/vehicles/${id}`, payload)
}

export function deleteVehicle(id: number) {
  return deleteJson<{ message: string }>(`/api/vehicles/${id}`)
}

export function getDriverPreferences() {
  return getJson<PreferencesResponse>("/api/preferences")
}

export function updateDriverPreferences(payload: Pick<DriverPreference, "allowSmoking" | "allowAnimals">) {
  return putJson<PreferencesResponse, Pick<DriverPreference, "allowSmoking" | "allowAnimals">>(
    "/api/preferences/standard",
    payload,
  )
}

export function createCustomPreference(label: string) {
  return postJson<CustomPreferenceResponse, { label: string }>("/api/preferences/custom", { label })
}

export function deleteCustomPreference(id: number) {
  return deleteJson<PreferencesResponse>(`/api/preferences/custom/${id}`)
}
