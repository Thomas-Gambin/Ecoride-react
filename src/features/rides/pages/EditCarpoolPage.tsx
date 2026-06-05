import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { getVehicles } from "@/features/profile/api/profile"
import type { Vehicle } from "@/features/profile/types/profile"
import type { ProfileType } from "@/features/auth/types/user"
import { getCarpool, updateCarpool } from "@/features/rides/api/carpools"
import { CreateCarpoolForm, DriverRequiredMessage } from "@/features/rides/components/CreateCarpoolForm"
import {
  carpoolToFormInitialValues,
  isCarpoolEditable,
  type CarpoolRecord,
  type UpdateCarpoolPayload,
} from "@/features/rides/types/createCarpool"
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

export default function EditCarpoolPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const carpoolId = Number.parseInt(id ?? "", 10)

  const [carpool, setCarpool] = useState<CarpoolRecord | null>(null)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverErrors, setServerErrors] = useState<FieldErrors>({})

  useEffect(() => {
    if (!user || !isDriverProfile(user.profileType) || !Number.isFinite(carpoolId)) {
      setIsLoading(false)
      return
    }

    let ignore = false

    async function loadData() {
      setIsLoading(true)
      try {
        const [carpoolResponse, vehiclesResponse] = await Promise.all([getCarpool(carpoolId), getVehicles()])
        if (ignore) return

        if (!isCarpoolEditable(carpoolResponse.carpool)) {
          toast.error("Ce trajet ne peut plus être modifié.")
          navigate("/trajets/mes-trajets")
          return
        }

        setCarpool(carpoolResponse.carpool)
        setVehicles(vehiclesResponse.vehicles)
      } catch (error) {
        if (!ignore) {
          const apiError = parseApiError(error)
          toast.error(apiError.message ?? "Impossible de charger le trajet.")
          navigate("/trajets/mes-trajets")
        }
      } finally {
        if (!ignore) setIsLoading(false)
      }
    }

    void loadData()

    return () => {
      ignore = true
    }
  }, [user, carpoolId, navigate])

  const handleSubmit = async (payload: UpdateCarpoolPayload) => {
    if (!Number.isFinite(carpoolId)) return

    setIsSubmitting(true)
    setServerErrors({})

    try {
      await updateCarpool(carpoolId, payload)
      toast.success("Votre trajet a bien été mis à jour.")
      navigate("/trajets/mes-trajets")
    } catch (error) {
      const apiError = parseApiError(error)
      toast.error(apiError.message ?? "Impossible de mettre à jour le trajet.")
      setServerErrors(normalizeServerErrors(apiError.fields))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) return null

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14">
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
        <Link to="/trajets/mes-trajets" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-300">
          ← Retour à mes trajets
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">Modifier le trajet</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-300">
          Mettez à jour votre itinéraire, votre tarif ou le véhicule utilisé.
        </p>
      </motion.div>

      {!isDriverProfile(user.profileType) ? (
        <DriverRequiredMessage />
      ) : isLoading || !carpool ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-300">Chargement…</p>
      ) : (
        <CreateCarpoolForm
          mode="edit"
          initialValues={carpoolToFormInitialValues(carpool)}
          vehicles={vehicles}
          isSubmitting={isSubmitting}
          serverErrors={serverErrors}
          onSubmit={(payload) => handleSubmit(payload as UpdateCarpoolPayload)}
        />
      )}
    </main>
  )
}
