import { CARPOOL_MOCK_RECORDS } from "./carpoolMocks"
import { isCarpoolSearchable, mapCarpoolToRide } from "../utils/mapCarpoolToRide"
import type { Ride } from "../types/ride"

export const MOCK_CARPOOL_RIDES: Ride[] = CARPOOL_MOCK_RECORDS.map(mapCarpoolToRide)

export const MOCK_RIDES: Ride[] = CARPOOL_MOCK_RECORDS.filter(isCarpoolSearchable).map(mapCarpoolToRide)
