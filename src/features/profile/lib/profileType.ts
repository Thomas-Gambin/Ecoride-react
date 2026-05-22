import type { ProfileType } from "@/features/profile/types/profile"

const labels: Record<ProfileType, string> = {
  passenger: "Passager",
  driver: "Chauffeur",
  passenger_driver: "Passager & chauffeur",
}

export function profileTypeLabel(profileType: ProfileType) {
  return labels[profileType]
}
