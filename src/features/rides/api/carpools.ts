import { deleteJson, getJson, postJson, putJson } from "@/shared/api/client"
import type {
  CarpoolRecord,
  CreateCarpoolPayload,
  CreateCarpoolResponse,
  MyCarpoolsResponse,
  UpdateCarpoolPayload,
} from "../types/createCarpool"

export function getMyCarpools() {
  return getJson<MyCarpoolsResponse>("/api/carpools/mine")
}

export function getCarpool(id: number) {
  return getJson<{ carpool: CarpoolRecord }>(`/api/carpools/${id}`)
}

export function createCarpool(payload: CreateCarpoolPayload) {
  return postJson<CreateCarpoolResponse, CreateCarpoolPayload>("/api/carpools", payload)
}

export function updateCarpool(id: number, payload: UpdateCarpoolPayload) {
  return putJson<{ message: string; carpool: CarpoolRecord }, UpdateCarpoolPayload>(`/api/carpools/${id}`, payload)
}

export function deleteCarpool(id: number) {
  return deleteJson<{ message: string }>(`/api/carpools/${id}`)
}
