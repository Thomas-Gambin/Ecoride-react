import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { getVehicles } from "@/features/profile/api/profile"
import type { Vehicle } from "@/features/profile/types/profile"
import type { ProfileType } from "@/features/auth/types/user"
import { createCarpool } from "@/features/rides/api/carpools"
import { CreateCarpoolForm, DriverRequiredMessage } from "@/features/rides/components/CreateCarpoolForm"
import type { CreateCarpoolPayload } from "@/features/rides/types/createCarpool"
import { fadeUp } from "@/features/profile/lib/motion"
import type { ApiErrorShape } from "@/shared/api/client"
import { useAuth } from "@/shared/hooks/useAuth"
import { toast } from "@/shared/lib/toast"

type FieldErrors = Partial<Record<string, string>>

const isDriverProfile = (profileType: ProfileType) => profileType === "driver" || profileType === "passenger_driver"

function parseApiError(error: unknown): ApiErrorShape {
  if (error instanceof Error) {
    try {
      return JSON.parse(error.message) as ApiErrorShape
    } catch {
      return { message: error.message }
    }
  }

  return { message: "Une erreur est survenue." }
}

function normalizeServerErrors(fields?: Record<string, string>): FieldErrors {
  if (!fields) return {}

  const mapped: FieldErrors = { ...fields }

  if (fields["departureCity.name"] || fields["departureCity.code"] || fields["departureCity.postalCode"]) {
    mapped.departureCity =
      fields["departureCity.name"] ?? fields["departureCity.code"] ?? fields["departureCity.postalCode"]
  }

  if (fields["arrivalCity.name"] || fields["arrivalCity.code"] || fields["arrivalCity.postalCode"]) {
    mapped.arrivalCity = fields["arrivalCity.name"] ?? fields["arrivalCity.code"] ?? fields["arrivalCity.postalCode"]
  }

  return mapped
}

export default function CreateCarpoolPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverErrors, setServerErrors] = useState<FieldErrors>({})

  useEffect(() => {
    let ignore = false

    async function loadVehicles() {
      setIsLoading(true)
      try {
        const response = await getVehicles()
        if (!ignore) {
          setVehicles(response.vehicles)
        }
      } catch {
        if (!ignore) {
          toast.error("Impossible de charger vos véhicules.")
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    if (user && isDriverProfile(user.profileType)) {
      void loadVehicles()
    } else {
      setIsLoading(false)
    }

    return () => {
      ignore = true
    }
  }, [user])

  const handleSubmit = async (payload: CreateCarpoolPayload) => {
    setIsSubmitting(true)
    setServerErrors({})

    try {
      await createCarpool(payload)
      toast.success("Votre trajet a bien été créé.")
      navigate("/trajets/mes-trajets")
    } catch (error) {
      const apiError = parseApiError(error)
      toast.error(apiError.message ?? "Impossible de créer le trajet.")
      setServerErrors(normalizeServerErrors(apiError.fields))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14">
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">EcoRide</p>
        <h1 className="mt-2 text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">Créer un trajet</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-300">
          Proposez un covoiturage en renseignant votre itinéraire, votre tarif et le véhicule utilisé.
        </p>
      </motion.div>

      {!isDriverProfile(user.profileType) ? (
        <DriverRequiredMessage />
      ) : isLoading ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-300">Chargement…</p>
      ) : (
        <CreateCarpoolForm
          vehicles={vehicles}
          isSubmitting={isSubmitting}
          serverErrors={serverErrors}
          onSubmit={handleSubmit}
        />
      )}
    </main>
  )
}
