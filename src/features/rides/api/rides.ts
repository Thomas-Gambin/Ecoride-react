// TODO: décommenter et brancher sur le back-end Symfony (entité Carpool) quand l'endpoint sera disponible.
// import { getJson } from "@/shared/api/client"
// import { mapCarpoolToRide } from "../utils/mapCarpoolToRide"
// import type { CarpoolMockRecord } from "../types/carpool"
// import type { Ride, RideSearchParams } from "../types/ride"
//
// export async function fetchRides(params: RideSearchParams): Promise<Ride[]> {
//   const query = new URLSearchParams({
//     departure: params.departure,
//     arrival: params.arrival,
//     date: params.date,
//   })
//   const records = await getJson<CarpoolMockRecord[]>(`/api/rides?${query.toString()}`)
//   return records.map(mapCarpoolToRide)
// }
