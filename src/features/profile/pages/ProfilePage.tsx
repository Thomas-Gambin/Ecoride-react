import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { AccountSummary } from "../components/AccountSummary"
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
  getMe,
  getVehicles,
  updateDriverPreferences,
  updateProfileType,
  updateVehicle,
} from "../api/profile"
import type { ApiErrorShape } from "@/shared/api/client"
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
  const [user, setUser] = useState<AuthUser | null>(null)
  const [selectedProfileType, setSelectedProfileType] = useState<ProfileType>("passenger")
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [preferences, setPreferences] = useState<DriverPreference>(defaultPreferences)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [isAddingVehicle, setIsAddingVehicle] = useState(false)
  const [vehicleErrors, setVehicleErrors] = useState<FieldErrors>({})
  const [isLoading, setIsLoading] = useState(true)
  const [saving, setSaving] = useState<"profile" | "vehicle" | "preferences" | "custom" | null>(null)
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null)

  useEffect(() => {
    let ignore = false

    async function loadProfile() {
      setIsLoading(true)
      setNotice(null)
      try {
        const [meResponse, vehiclesResponse, preferencesResponse] = await Promise.all([
          getMe(),
          getVehicles(),
          getDriverPreferences(),
        ])
        if (ignore) return
        setUser(meResponse.user)
        setSelectedProfileType(meResponse.user.profileType)
        setVehicles(vehiclesResponse.vehicles)
        setPreferences(preferencesResponse.preferences)
      } catch (error) {
        if (!ignore) {
          setNotice({ type: "error", message: parseApiError(error).message })
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

  const showDriverSections = useMemo(() => isDriverProfile(selectedProfileType), [selectedProfileType])

  const saveProfileType = async () => {
    setSaving("profile")
    setNotice(null)
    try {
      const response = await updateProfileType(selectedProfileType)
      setUser(response.user)
      window.dispatchEvent(new CustomEvent<AuthUser>("ecoride:session-updated", { detail: response.user }))
      setNotice({ type: "success", message: response.message })
    } catch (error) {
      const apiError = parseApiError(error)
      const extra = apiError.fields ? ` ${Object.values(apiError.fields).join(" ")}` : ""
      setNotice({ type: "error", message: `${apiError.message}${extra}` })
    } finally {
      setSaving(null)
    }
  }

  const submitVehicle = async (payload: VehiclePayload) => {
    setSaving("vehicle")
    setNotice(null)
    setVehicleErrors({})
    try {
      if (editingVehicle) {
        const response = await updateVehicle(editingVehicle.id, payload)
        setVehicles((current) => current.map((vehicle) => (vehicle.id === response.vehicle.id ? response.vehicle : vehicle)))
        setNotice({ type: "success", message: response.message })
      } else {
        const response = await createVehicle(payload)
        setVehicles((current) => [...current, response.vehicle])
        setNotice({ type: "success", message: response.message })
      }
      setEditingVehicle(null)
      setIsAddingVehicle(false)
    } catch (error) {
      const apiError = parseApiError(error)
      setVehicleErrors({ ...normalizeVehicleErrors(apiError.fields), form: apiError.message })
      setNotice({ type: "error", message: apiError.message })
    } finally {
      setSaving(null)
    }
  }

  const removeVehicle = async (vehicle: Vehicle) => {
    const confirmed = window.confirm(`Supprimer le véhicule ${vehicle.brand} ${vehicle.model} ?`)
    if (!confirmed) return

    setSaving("vehicle")
    setNotice(null)
    try {
      const response = await deleteVehicle(vehicle.id)
      setVehicles((current) => current.filter((item) => item.id !== vehicle.id))
      setNotice({ type: "success", message: response.message })
    } catch (error) {
      setNotice({ type: "error", message: parseApiError(error).message })
    } finally {
      setSaving(null)
    }
  }

  const savePreferences = async () => {
    setSaving("preferences")
    setNotice(null)
    try {
      const response = await updateDriverPreferences({
        allowSmoking: preferences.allowSmoking,
        allowAnimals: preferences.allowAnimals,
      })
      setPreferences(response.preferences)
      setNotice({ type: "success", message: response.message ?? "Préférences enregistrées." })
    } catch (error) {
      setNotice({ type: "error", message: parseApiError(error).message })
    } finally {
      setSaving(null)
    }
  }

  const addCustomPreference = async (label: string) => {
    setSaving("custom")
    setNotice(null)
    try {
      const response = await createCustomPreference(label)
      setPreferences(response.preferences)
      setNotice({ type: "success", message: response.message ?? "Préférence ajoutée." })
    } catch (error) {
      setNotice({ type: "error", message: parseApiError(error).message })
    } finally {
      setSaving(null)
    }
  }

  const removeCustomPreference = async (id: number) => {
    setSaving("custom")
    setNotice(null)
    try {
      const response = await deleteCustomPreference(id)
      setPreferences(response.preferences)
      setNotice({ type: "success", message: response.message ?? "Préférence supprimée." })
    } catch (error) {
      setNotice({ type: "error", message: parseApiError(error).message })
    } finally {
      setSaving(null)
    }
  }

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-[50vh] w-full max-w-6xl items-center justify-center px-6 py-14">
        <p className="text-sm text-zinc-600 dark:text-zinc-300" role="status" aria-live="polite">
          Chargement du profil…
        </p>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="mx-auto w-full max-w-6xl px-6 py-14">
        <p className="rounded-3xl bg-rose-50 p-5 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-200" role="alert">
          Impossible de charger votre profil.
        </p>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
              EcoRide
            </p>
            <h1 className="mt-3 text-3xl font-extrabold text-zinc-950 dark:text-zinc-50">Mon profil</h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-300">
              Gérez votre compte, vos véhicules et vos préférences de conduite depuis un seul espace.
            </p>
          </div>
          <span className="inline-flex w-fit rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-900 dark:border-emerald-700/50 dark:bg-emerald-500/10 dark:text-emerald-100">
            {profileTypeLabel(user.profileType)}
          </span>
        </div>

        {notice ? (
          <p
            className={
              notice.type === "success"
                ? "mt-6 rounded-3xl bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-100"
                : "mt-6 rounded-3xl bg-rose-50 p-4 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-200"
            }
            role={notice.type === "error" ? "alert" : "status"}
            aria-live="polite"
          >
            {notice.message}
          </p>
        ) : null}

        <div className="mt-8 space-y-6">
          <AccountSummary user={user} />
          <ProfileTypeSelector
            value={selectedProfileType}
            savedValue={user.profileType}
            isSaving={saving === "profile"}
            onChange={setSelectedProfileType}
            onSave={saveProfileType}
          />

          {showDriverSections ? (
            <>
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
              <DriverPreferencesForm
                preferences={preferences}
                isSaving={saving === "preferences"}
                onChange={(next) => setPreferences((current) => ({ ...current, ...next }))}
                onSave={savePreferences}
              />
              <CustomPreferencesList
                preferences={preferences.customPreferences}
                isSaving={saving === "custom"}
                onAdd={addCustomPreference}
                onDelete={removeCustomPreference}
              />
            </>
          ) : null}
        </div>
      </motion.div>
    </main>
  )
}
