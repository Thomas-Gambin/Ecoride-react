import { useMemo, useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { CityAutocomplete } from "@/shared/components/CityAutocomplete"
import SoftCard from "@/features/homePage/components/SoftCard"
import { CAR_ENERGY_OPTIONS, type Vehicle, type VehiclePayload } from "@/features/profile/types/profile"
import { fadeUp, staggerItems, tapScale } from "@/features/profile/lib/motion"
import {
  PLATFORM_FEE_CREDITS,
  type CarpoolFormInitialValues,
  type CommuneSelection,
  type CreateCarpoolPayload,
  type UpdateCarpoolPayload,
} from "@/features/rides/types/createCarpool"
import { cn } from "@/shared/lib/utils"

type FieldErrors = Partial<
  Record<
    | "departureCity"
    | "arrivalCity"
    | "departureDate"
    | "departureTime"
    | "arrivalTime"
    | "priceCredits"
    | "seatCount"
    | "vehicleId"
    | "registrationNumber"
    | "firstRegistrationDate"
    | "brand"
    | "model"
    | "color"
    | "energy"
    | "form",
    string
  >
>

const emptyVehiclePayload: VehiclePayload = {
  registrationNumber: "",
  firstRegistrationDate: "",
  brand: "",
  model: "",
  color: "",
  energy: "",
}

const NEW_VEHICLE_VALUE = "new"

type CreateCarpoolFormProps = {
  mode?: "create" | "edit"
  initialValues?: CarpoolFormInitialValues
  vehicles: Vehicle[]
  isSubmitting: boolean
  serverErrors?: FieldErrors
  onSubmit: (payload: CreateCarpoolPayload | UpdateCarpoolPayload) => void
}

function tomorrowIsoDate(): string {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return date.toISOString().slice(0, 10)
}

function buildInitialFormState(initialValues?: CarpoolFormInitialValues, vehicles: Vehicle[] = []) {
  if (initialValues) {
    return {
      departureQuery: initialValues.departureCity.name,
      arrivalQuery: initialValues.arrivalCity.name,
      departureCity: initialValues.departureCity,
      arrivalCity: initialValues.arrivalCity,
      departureDate: initialValues.departureDate,
      departureTime: initialValues.departureTime,
      arrivalTime: initialValues.arrivalTime,
      priceCredits: String(initialValues.priceCredits),
      seatCount: String(initialValues.seatCount),
      vehicleChoice: String(initialValues.vehicleId),
    }
  }

  return {
    departureQuery: "",
    arrivalQuery: "",
    departureCity: null as CommuneSelection | null,
    arrivalCity: null as CommuneSelection | null,
    departureDate: tomorrowIsoDate(),
    departureTime: "08:00",
    arrivalTime: "12:00",
    priceCredits: "10",
    seatCount: "3",
    vehicleChoice: vehicles[0] ? String(vehicles[0].id) : NEW_VEHICLE_VALUE,
  }
}

function validateVehicle(payload: VehiclePayload): FieldErrors {
  const errors: FieldErrors = {}
  if (!payload.registrationNumber.trim()) errors.registrationNumber = "La plaque est obligatoire."
  if (!payload.firstRegistrationDate) errors.firstRegistrationDate = "La date est obligatoire."
  if (payload.firstRegistrationDate && new Date(payload.firstRegistrationDate) > new Date()) {
    errors.firstRegistrationDate = "La date ne peut pas être dans le futur."
  }
  if (!payload.brand.trim()) errors.brand = "La marque est obligatoire."
  if (!payload.model.trim()) errors.model = "Le modèle est obligatoire."
  if (!payload.color.trim()) errors.color = "La couleur est obligatoire."
  if (!payload.energy.trim()) errors.energy = "L’énergie est obligatoire."
  if (payload.energy && !CAR_ENERGY_OPTIONS.some((option) => option.value === payload.energy)) {
    errors.energy = "L’énergie sélectionnée est invalide."
  }
  return errors
}

export function CreateCarpoolForm({
  mode = "create",
  initialValues,
  vehicles,
  isSubmitting,
  serverErrors = {},
  onSubmit,
}: CreateCarpoolFormProps) {
  const isEditMode = mode === "edit"
  const initialState = buildInitialFormState(initialValues, vehicles)
  const [departureQuery, setDepartureQuery] = useState(initialState.departureQuery)
  const [arrivalQuery, setArrivalQuery] = useState(initialState.arrivalQuery)
  const [departureCity, setDepartureCity] = useState<CommuneSelection | null>(initialState.departureCity)
  const [arrivalCity, setArrivalCity] = useState<CommuneSelection | null>(initialState.arrivalCity)
  const [departureDate, setDepartureDate] = useState(initialState.departureDate)
  const [departureTime, setDepartureTime] = useState(initialState.departureTime)
  const [arrivalTime, setArrivalTime] = useState(initialState.arrivalTime)
  const [priceCredits, setPriceCredits] = useState(initialState.priceCredits)
  const [seatCount, setSeatCount] = useState(initialState.seatCount)
  const [vehicleChoice, setVehicleChoice] = useState(initialState.vehicleChoice)
  const [newVehicle, setNewVehicle] = useState<VehiclePayload>(emptyVehiclePayload)
  const [errors, setErrors] = useState<FieldErrors>({})

  const visibleErrors = { ...serverErrors, ...errors }
  const isNewVehicle = !isEditMode && vehicleChoice === NEW_VEHICLE_VALUE
  const parsedPrice = Number.parseInt(priceCredits, 10)
  const estimatedDriverGain = Number.isFinite(parsedPrice) ? Math.max(0, parsedPrice - PLATFORM_FEE_CREDITS) : 0

  const vehicleOptions = useMemo(
    () =>
      vehicles.map((vehicle) => ({
        value: String(vehicle.id),
        label: `${vehicle.brand} ${vehicle.model} — ${vehicle.color} (${vehicle.energy})`,
      })),
    [vehicles],
  )

  const validate = (): FieldErrors => {
    const nextErrors: FieldErrors = {}

    if (!departureCity) nextErrors.departureCity = "Sélectionnez une commune de départ valide."
    if (!arrivalCity) nextErrors.arrivalCity = "Sélectionnez une commune d’arrivée valide."
    if (!departureDate) nextErrors.departureDate = "La date est obligatoire."
    if (departureDate && departureDate < new Date().toISOString().slice(0, 10)) {
      nextErrors.departureDate = "La date ne peut pas être dans le passé."
    }
    if (!departureTime) nextErrors.departureTime = "L’heure de départ est obligatoire."
    if (!arrivalTime) nextErrors.arrivalTime = "L’heure d’arrivée est obligatoire."
    if (departureTime && arrivalTime && arrivalTime <= departureTime) {
      nextErrors.arrivalTime = "L’heure d’arrivée doit être postérieure à l’heure de départ."
    }

    const price = Number.parseInt(priceCredits, 10)
    if (!Number.isFinite(price) || price <= PLATFORM_FEE_CREDITS) {
      nextErrors.priceCredits = `Le prix doit être strictement supérieur à ${PLATFORM_FEE_CREDITS} crédits.`
    }

    const seats = Number.parseInt(seatCount, 10)
    if (!Number.isFinite(seats) || seats < 1) {
      nextErrors.seatCount = "Le nombre de places doit être au moins 1."
    }

    if (isNewVehicle) {
      Object.assign(nextErrors, validateVehicle(newVehicle))
    } else if (!vehicleChoice) {
      nextErrors.vehicleId = "Sélectionnez un véhicule."
    }

    return nextErrors
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0 || !departureCity || !arrivalCity) return

    const basePayload = {
      departureCity: {
        name: departureCity.name,
        code: departureCity.code,
        postalCode: departureCity.postalCode,
      },
      arrivalCity: {
        name: arrivalCity.name,
        code: arrivalCity.code,
        postalCode: arrivalCity.postalCode,
      },
      departureDate,
      departureTime,
      arrivalTime,
      priceCredits: Number.parseInt(priceCredits, 10),
      seatCount: Number.parseInt(seatCount, 10),
    }

    if (isEditMode) {
      const payload: UpdateCarpoolPayload = {
        ...basePayload,
        vehicleId: Number.parseInt(vehicleChoice, 10),
      }
      onSubmit(payload)
      return
    }

    const payload: CreateCarpoolPayload = { ...basePayload }
    if (isNewVehicle) {
      payload.newVehicle = {
        ...newVehicle,
        registrationNumber: newVehicle.registrationNumber.trim().toUpperCase(),
        brand: newVehicle.brand.trim(),
        model: newVehicle.model.trim(),
        color: newVehicle.color.trim(),
      }
    } else {
      payload.vehicleId = Number.parseInt(vehicleChoice, 10)
    }

    onSubmit(payload)
  }

  const setVehicleField = <TKey extends keyof VehiclePayload>(field: TKey, value: VehiclePayload[TKey]) => {
    setNewVehicle((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined, form: undefined }))
  }

  const submitLabel = isEditMode
    ? isSubmitting
      ? "Mise à jour…"
      : "Mettre à jour le trajet"
    : isSubmitting
      ? "Enregistrement…"
      : "Enregistrer le trajet"

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      variants={staggerItems}
      initial="hidden"
      animate="visible"
    >
      {visibleErrors.form ? (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-200"
          role="alert"
        >
          {visibleErrors.form}
        </motion.p>
      ) : null}

      <SoftCard interactive={false} className="space-y-5 p-6 md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">Itinéraire</p>
        <div className="grid gap-4 md:grid-cols-2">
          <motion.div variants={fadeUp}>
            <CityAutocomplete
              label="Ville de départ"
              value={departureQuery}
              selected={departureCity}
              onChange={setDepartureQuery}
              onSelect={setDepartureCity}
              error={visibleErrors.departureCity}
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <CityAutocomplete
              label="Ville d’arrivée"
              value={arrivalQuery}
              selected={arrivalCity}
              onChange={setArrivalQuery}
              onSelect={setArrivalCity}
              error={visibleErrors.arrivalCity}
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <FormInput
              label="Date du trajet"
              type="date"
              value={departureDate}
              min={new Date().toISOString().slice(0, 10)}
              error={visibleErrors.departureDate}
              onChange={setDepartureDate}
            />
          </motion.div>
          <motion.div variants={fadeUp} className="grid gap-4 sm:grid-cols-2">
            <FormInput
              label="Heure de départ"
              type="time"
              value={departureTime}
              error={visibleErrors.departureTime}
              onChange={setDepartureTime}
            />
            <FormInput
              label="Heure d’arrivée"
              type="time"
              value={arrivalTime}
              error={visibleErrors.arrivalTime}
              onChange={setArrivalTime}
            />
          </motion.div>
        </div>
      </SoftCard>

      <SoftCard interactive={false} className="space-y-5 p-6 md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">Tarification</p>
        <div className="grid gap-4 md:grid-cols-2">
          <motion.div variants={fadeUp}>
            <FormInput
              label="Prix en crédits (payé par le passager)"
              type="number"
              min={PLATFORM_FEE_CREDITS + 1}
              value={priceCredits}
              error={visibleErrors.priceCredits}
              onChange={setPriceCredits}
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <FormInput
              label="Places disponibles"
              type="number"
              min={1}
              value={seatCount}
              error={visibleErrors.seatCount}
              onChange={setSeatCount}
            />
          </motion.div>
        </div>
        <motion.div
          variants={fadeUp}
          className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-4 text-sm text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100"
        >
          <p>Prix passager : {Number.isFinite(parsedPrice) ? parsedPrice : "—"} crédits</p>
          <p>Commission plateforme : {PLATFORM_FEE_CREDITS} crédits</p>
          <p className="font-semibold">Gain estimé chauffeur : {estimatedDriverGain} crédits</p>
        </motion.div>
      </SoftCard>

      <SoftCard interactive={false} className="space-y-5 p-6 md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">Véhicule</p>
        <motion.div variants={fadeUp}>
          <label className="block">
            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Véhicule utilisé</span>
            <select
              value={vehicleChoice}
              onChange={(event) => {
                setVehicleChoice(event.target.value)
                setErrors((current) => ({ ...current, vehicleId: undefined }))
              }}
              className={cn(
                "mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition",
                "focus-visible:ring-2 focus-visible:ring-emerald-700/25 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50",
                visibleErrors.vehicleId
                  ? "border-rose-300 focus-visible:ring-rose-500/30 dark:border-rose-500/50"
                  : "border-stone-200 dark:border-zinc-800",
              )}
            >
              <option value="">Choisir un véhicule</option>
              {vehicleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
              {!isEditMode ? <option value={NEW_VEHICLE_VALUE}>Ajouter un nouveau véhicule</option> : null}
            </select>
            {visibleErrors.vehicleId ? (
              <span className="mt-1 block text-sm text-rose-700 dark:text-rose-200">{visibleErrors.vehicleId}</span>
            ) : null}
          </label>
        </motion.div>

        {isNewVehicle ? (
          <motion.div variants={fadeUp} className="grid gap-4 md:grid-cols-2">
            <FormInput
              label="Plaque d’immatriculation"
              value={newVehicle.registrationNumber}
              error={visibleErrors.registrationNumber}
              onChange={(value) => setVehicleField("registrationNumber", value)}
              placeholder="AA-123-AA"
            />
            <FormInput
              label="Date de première immatriculation"
              type="date"
              value={newVehicle.firstRegistrationDate}
              error={visibleErrors.firstRegistrationDate}
              onChange={(value) => setVehicleField("firstRegistrationDate", value)}
            />
            <FormInput
              label="Marque"
              value={newVehicle.brand}
              error={visibleErrors.brand}
              onChange={(value) => setVehicleField("brand", value)}
            />
            <FormInput
              label="Modèle"
              value={newVehicle.model}
              error={visibleErrors.model}
              onChange={(value) => setVehicleField("model", value)}
            />
            <FormInput
              label="Couleur"
              value={newVehicle.color}
              error={visibleErrors.color}
              onChange={(value) => setVehicleField("color", value)}
            />
            <label className="block">
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Énergie</span>
              <select
                value={newVehicle.energy}
                onChange={(event) => setVehicleField("energy", event.target.value)}
                className={cn(
                  "mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition",
                  "focus-visible:ring-2 focus-visible:ring-emerald-700/25 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50",
                  visibleErrors.energy
                    ? "border-rose-300 focus-visible:ring-rose-500/30 dark:border-rose-500/50"
                    : "border-stone-200 dark:border-zinc-800",
                )}
              >
                <option value="">Sélectionner une énergie</option>
                {CAR_ENERGY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {visibleErrors.energy ? (
                <span className="mt-1 block text-sm text-rose-700 dark:text-rose-200">{visibleErrors.energy}</span>
              ) : null}
            </label>
          </motion.div>
        ) : null}
      </SoftCard>

      <motion.div variants={fadeUp} className="flex justify-end">
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileTap={!isSubmitting ? tapScale : undefined}
          className="cursor-pointer rounded-2xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-600 dark:disabled:bg-zinc-800"
        >
          {submitLabel}
        </motion.button>
      </motion.div>
    </motion.form>
  )
}

function FormInput({
  label,
  value,
  error,
  onChange,
  type = "text",
  min,
  placeholder,
}: {
  label: string
  value: string
  error?: string
  onChange: (value: string) => void
  type?: string
  min?: number | string
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{label}</span>
      <input
        type={type}
        value={value}
        min={min}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        className={cn(
          "mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400",
          "focus-visible:ring-2 focus-visible:ring-emerald-700/25 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50",
          error
            ? "border-rose-300 focus-visible:ring-rose-500/30 dark:border-rose-500/50"
            : "border-stone-200 dark:border-zinc-800",
        )}
      />
      {error ? <span className="mt-1 block text-sm text-rose-700 dark:text-rose-200">{error}</span> : null}
    </label>
  )
}

export function DriverRequiredMessage() {
  return (
    <SoftCard interactive={false} className="space-y-4 p-8 text-center">
      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Rôle chauffeur requis</h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-300">
        Vous devez activer le rôle chauffeur dans votre profil pour gérer vos trajets.
      </p>
      <Link
        to="/profil"
        className="inline-flex rounded-2xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
      >
        Aller au profil
      </Link>
    </SoftCard>
  )
}
