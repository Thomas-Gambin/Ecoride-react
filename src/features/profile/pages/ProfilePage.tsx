import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AccountSummary } from "../components/AccountSummary"
import { ProfileLoadingSkeleton } from "../components/ProfileLoadingSkeleton"
import { collapseSection, fadeUp, staggerSections } from "../lib/motion"
import { CustomPreferencesList } from "../components/CustomPreferencesList"
import { DriverPreferencesForm } from "../components/DriverPreferencesForm"
import { ProfileTypeSelector } from "../components/ProfileTypeSelector"
import { VehicleList } from "../components/VehicleList"
import { profileTypeLabel } from "../lib/profileType"
import {
  createCustomPreference,
  createVehicle,
  deleteCustomPreference,
  deleteVehicle,
  getDriverPreferences,
  getProfile,
  getVehicles,
  updateDriverPreferences,
  updateProfileRole,
  updateVehicle,
} from "../api/profile"
import type { ApiErrorShape } from "@/shared/api/client"
import { toast } from "@/shared/lib/toast"
import { useAuth } from "@/shared/hooks/useAuth"
import type { AuthUser, ProfileType } from "@/features/auth/types/user"
import type { DriverPreference, Vehicle, VehiclePayload } from "../types/profile"

type FieldErrors = Partial<Record<keyof VehiclePayload | "form", string>>

const defaultPreferences: DriverPreference = {
  allowSmoking: false,
  allowAnimals: false,
  customPreferences: [],
}

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

function normalizeVehicleErrors(fields?: Record<string, string>): FieldErrors {
  if (!fields) return {}
  return fields as FieldErrors
}

export default function ProfilePage() {
  const { refreshUser } = useAuth()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [selectedProfileType, setSelectedProfileType] = useState<ProfileType>("passenger")
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [preferences, setPreferences] = useState<DriverPreference>(defaultPreferences)
  const [savedPreferences, setSavedPreferences] = useState<DriverPreference>(defaultPreferences)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [isAddingVehicle, setIsAddingVehicle] = useState(false)
  const [vehicleErrors, setVehicleErrors] = useState<FieldErrors>({})
  const [isLoading, setIsLoading] = useState(true)
  const [saving, setSaving] = useState<"profile" | "vehicle" | "preferences" | "custom" | null>(null)

  const showDriverSections = useMemo(() => isDriverProfile(selectedProfileType), [selectedProfileType])

  useEffect(() => {
    let ignore = false

    async function loadProfile() {
      setIsLoading(true)
      try {
        const profileResponse = await getProfile()
        if (ignore) return

        setUser(profileResponse.user)
        setSelectedProfileType(profileResponse.user.profileType)
      } catch (error) {
        if (!ignore) {
          toast.error(parseApiError(error).message)
        }
      } finally {
        if (!ignore) setIsLoading(false)
      }
    }

    void loadProfile()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    if (isLoading) return

    let ignore = false

    async function loadDriverData() {
      if (!showDriverSections) {
        setVehicles([])
        setPreferences(defaultPreferences)
        setSavedPreferences(defaultPreferences)
        setEditingVehicle(null)
        setIsAddingVehicle(false)
        return
      }

      try {
        const [vehiclesResponse, preferencesResponse] = await Promise.all([getVehicles(), getDriverPreferences()])
        if (ignore) return
        setVehicles(vehiclesResponse.vehicles)
        setPreferences(preferencesResponse.preferences)
        setSavedPreferences(preferencesResponse.preferences)
      } catch (error) {
        if (!ignore) {
          toast.error(parseApiError(error).message)
        }
      }
    }

    void loadDriverData()

    return () => {
      ignore = true
    }
  }, [showDriverSections, isLoading])

  const saveProfileType = async () => {
    setSaving("profile")
    try {
      const response = await updateProfileRole(selectedProfileType)
      setUser(response.user)
      setSelectedProfileType(response.user.profileType)
      await refreshUser()
      window.dispatchEvent(new CustomEvent<AuthUser>("ecoride:session-updated", { detail: response.user }))
      toast.success(response.message)
    } catch (error) {
      const apiError = parseApiError(error)
      if (apiError.code === "PROFILE_INCOMPLETE") {
        const hints = apiError.fields ? Object.values(apiError.fields).join(" ") : ""
        toast.error(
          `${apiError.message} Complétez vos véhicules et préférences ci-dessous, puis réessayez.${hints ? ` ${hints}` : ""}`,
        )
        return
      }
      const extra = apiError.fields ? ` ${Object.values(apiError.fields).join(" ")}` : ""
      toast.error(`${apiError.message}${extra}`)
    } finally {
      setSaving(null)
    }
  }

  const submitVehicle = async (payload: VehiclePayload) => {
    setSaving("vehicle")
    setVehicleErrors({})
    try {
      if (editingVehicle) {
        const response = await updateVehicle(editingVehicle.id, payload)
        setVehicles((current) => current.map((vehicle) => (vehicle.id === response.vehicle.id ? response.vehicle : vehicle)))
        toast.success(response.message)
      } else {
        const response = await createVehicle(payload)
        setVehicles((current) => [...current, response.vehicle])
        toast.success(response.message)
      }
      setEditingVehicle(null)
      setIsAddingVehicle(false)
    } catch (error) {
      const apiError = parseApiError(error)
      setVehicleErrors({ ...normalizeVehicleErrors(apiError.fields), form: apiError.message })
      toast.error(apiError.message)
    } finally {
      setSaving(null)
    }
  }

  const removeVehicle = async (vehicle: Vehicle) => {
    const confirmed = window.confirm(`Supprimer le véhicule ${vehicle.brand} ${vehicle.model} ?`)
    if (!confirmed) return

    setSaving("vehicle")
    try {
      const response = await deleteVehicle(vehicle.id)
      setVehicles((current) => current.filter((item) => item.id !== vehicle.id))
      toast.success(response.message)
    } catch (error) {
      toast.error(parseApiError(error).message)
    } finally {
      setSaving(null)
    }
  }

  const savePreferences = async () => {
    setSaving("preferences")
    try {
      const response = await updateDriverPreferences({
        allowSmoking: preferences.allowSmoking,
        allowAnimals: preferences.allowAnimals,
      })
      setPreferences(response.preferences)
      setSavedPreferences(response.preferences)
      toast.success(response.message ?? "Préférences enregistrées.")
    } catch (error) {
      toast.error(parseApiError(error).message)
    } finally {
      setSaving(null)
    }
  }

  const addCustomPreference = async (label: string) => {
    setSaving("custom")
    try {
      const response = await createCustomPreference(label)
      setPreferences(response.preferences)
      setSavedPreferences(response.preferences)
      toast.success(response.message ?? "Préférence ajoutée.")
    } catch (error) {
      toast.error(parseApiError(error).message)
    } finally {
      setSaving(null)
    }
  }

  const removeCustomPreference = async (id: number) => {
    setSaving("custom")
    try {
      const response = await deleteCustomPreference(id)
      setPreferences(response.preferences)
      setSavedPreferences(response.preferences)
      toast.success(response.message ?? "Préférence supprimée.")
    } catch (error) {
      toast.error(parseApiError(error).message)
    } finally {
      setSaving(null)
    }
  }

  if (isLoading) {
    return <ProfileLoadingSkeleton />
  }

  if (!user) {
    return (
      <main className="mx-auto w-full max-w-6xl px-6 py-14">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-rose-50 p-5 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-200"
          role="alert"
        >
          Impossible de charger votre profil.
        </motion.p>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14">
      <motion.div variants={staggerSections} initial="hidden" animate="visible">
        <motion.header variants={fadeUp} className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
              EcoRide
            </p>
            <h1 className="mt-3 text-3xl font-extrabold text-zinc-950 dark:text-zinc-50">Mon profil</h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-300">
              Gérez votre compte, vos véhicules et vos préférences de conduite depuis un seul espace.
            </p>
          </div>
          <motion.span
            layout
            className="inline-flex w-fit rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-900 dark:border-emerald-700/50 dark:bg-emerald-500/10 dark:text-emerald-100"
          >
            {profileTypeLabel(selectedProfileType)}
          </motion.span>
        </motion.header>

        <motion.div variants={staggerSections} className="mt-8 space-y-6">
          <motion.div variants={fadeUp}>
            <AccountSummary user={user} />
          </motion.div>
          <motion.div variants={fadeUp}>
            <ProfileTypeSelector
              value={selectedProfileType}
              savedValue={user.profileType}
              isSaving={saving === "profile"}
              onChange={setSelectedProfileType}
              onSave={saveProfileType}
            />
          </motion.div>

          <AnimatePresence initial={false}>
            {showDriverSections ? (
              <motion.div
                key="driver-sections"
                variants={collapseSection}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6 overflow-hidden"
              >
                <motion.div variants={fadeUp}>
                  <VehicleList
                    vehicles={vehicles}
                    editingVehicle={editingVehicle}
                    isAdding={isAddingVehicle}
                    isSaving={saving === "vehicle"}
                    serverErrors={vehicleErrors}
                    onStartAdd={() => {
                      setEditingVehicle(null)
                      setIsAddingVehicle(true)
                      setVehicleErrors({})
                    }}
                    onEdit={(vehicle) => {
                      setEditingVehicle(vehicle)
                      setIsAddingVehicle(false)
                      setVehicleErrors({})
                    }}
                    onCancelForm={() => {
                      setEditingVehicle(null)
                      setIsAddingVehicle(false)
                      setVehicleErrors({})
                    }}
                    onSubmit={submitVehicle}
                    onDelete={removeVehicle}
                  />
                </motion.div>
                <motion.div variants={fadeUp}>
                  <DriverPreferencesForm
                    preferences={preferences}
                    savedPreferences={savedPreferences}
                    isSaving={saving === "preferences"}
                    onChange={(next) => setPreferences((current) => ({ ...current, ...next }))}
                    onSave={savePreferences}
                  />
                </motion.div>
                <motion.div variants={fadeUp}>
                  <CustomPreferencesList
                    preferences={preferences.customPreferences}
                    isSaving={saving === "custom"}
                    onAdd={addCustomPreference}
                    onDelete={removeCustomPreference}
                  />
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </main>
  )
}
