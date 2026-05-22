import { deleteJson, getJson, patchJson, postJson, putJson } from "@/shared/api/client"
import { getMe } from "@/features/auth/api/me"
import type { AuthUser } from "@/features/auth/types/user"
import type {
  CustomPreferenceResponse,
  DriverPreference,
  PreferencesResponse,
  ProfileType,
  VehiclePayload,
  VehicleResponse,
  VehiclesResponse,
} from "../types/profile"

export { getMe }

export function updateProfileType(profileType: ProfileType) {
  return patchJson<{ message: string; user: AuthUser }, { profileType: ProfileType }>(
    "/api/me/profile-type",
    { profileType },
  )
}

export function getVehicles() {
  return getJson<VehiclesResponse>("/api/me/vehicles")
}

export function createVehicle(payload: VehiclePayload) {
  return postJson<VehicleResponse, VehiclePayload>("/api/me/vehicles", payload)
}

export function updateVehicle(id: number, payload: VehiclePayload) {
  return patchJson<VehicleResponse, VehiclePayload>(`/api/me/vehicles/${id}`, payload)
}

export function deleteVehicle(id: number) {
  return deleteJson<{ message: string }>(`/api/me/vehicles/${id}`)
}

export function getDriverPreferences() {
  return getJson<PreferencesResponse>("/api/me/preferences")
}

export function updateDriverPreferences(payload: Pick<DriverPreference, "allowSmoking" | "allowAnimals">) {
  return putJson<PreferencesResponse, Pick<DriverPreference, "allowSmoking" | "allowAnimals">>(
    "/api/me/preferences",
    payload,
  )
}

export function createCustomPreference(label: string) {
  return postJson<CustomPreferenceResponse, { label: string }>("/api/me/preferences/custom", { label })
}

export function deleteCustomPreference(id: number) {
  return deleteJson<PreferencesResponse>(`/api/me/preferences/custom/${id}`)
}
