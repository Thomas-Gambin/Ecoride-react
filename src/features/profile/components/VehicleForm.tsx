import { useState, type FormEvent } from "react"
import { motion } from "framer-motion"
import { CAR_ENERGY_OPTIONS, type Vehicle, type VehiclePayload } from "@/features/profile/types/profile"
import { fadeUp, staggerItems, tapScale } from "@/features/profile/lib/motion"
import { cn } from "@/shared/lib/utils"

type FieldErrors = Partial<Record<keyof VehiclePayload | "form", string>>

const emptyVehiclePayload: VehiclePayload = {
  registrationNumber: "",
  firstRegistrationDate: "",
  brand: "",
  model: "",
  color: "",
  energy: "",
}

function toPayload(vehicle?: Vehicle | null): VehiclePayload {
  if (!vehicle) return emptyVehiclePayload

  const knownEnergy = CAR_ENERGY_OPTIONS.find((option) => option.value === vehicle.energy)?.value

  return {
    registrationNumber: vehicle.registrationNumber,
    firstRegistrationDate: vehicle.firstRegistrationDate,
    brand: vehicle.brand,
    model: vehicle.model,
    color: vehicle.color,
    energy: knownEnergy ?? vehicle.energy,
  }
}

function validate(payload: VehiclePayload): FieldErrors {
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

type VehicleFormProps = {
  vehicle?: Vehicle | null
  isSaving: boolean
  serverErrors?: FieldErrors
  onSubmit: (payload: VehiclePayload) => void
  onCancel?: () => void
}

export function VehicleForm({ vehicle, isSaving, serverErrors = {}, onSubmit, onCancel }: VehicleFormProps) {
  const [payload, setPayload] = useState<VehiclePayload>(() => toPayload(vehicle))
  const [errors, setErrors] = useState<FieldErrors>({})

  const visibleErrors = { ...serverErrors, ...errors }

  const setField = <TKey extends keyof VehiclePayload>(field: TKey, value: VehiclePayload[TKey]) => {
    setPayload((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined, form: undefined }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate(payload)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onSubmit({
      ...payload,
      registrationNumber: payload.registrationNumber.trim().toUpperCase(),
      brand: payload.brand.trim(),
      model: payload.model.trim(),
      color: payload.color.trim(),
      energy: payload.energy,
    })
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4"
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

      <motion.div variants={fadeUp} className="grid gap-4 md:grid-cols-2">
        <Input
          label="Plaque d’immatriculation"
          value={payload.registrationNumber}
          error={visibleErrors.registrationNumber}
          onChange={(value) => setField("registrationNumber", value)}
          placeholder="AA-123-AA"
        />
        <Input
          label="Date de première immatriculation"
          value={payload.firstRegistrationDate}
          error={visibleErrors.firstRegistrationDate}
          onChange={(value) => setField("firstRegistrationDate", value)}
          type="date"
        />
        <Input label="Marque" value={payload.brand} error={visibleErrors.brand} onChange={(value) => setField("brand", value)} />
        <Input label="Modèle" value={payload.model} error={visibleErrors.model} onChange={(value) => setField("model", value)} />
        <Input label="Couleur" value={payload.color} error={visibleErrors.color} onChange={(value) => setField("color", value)} />
        <Select
          label="Énergie"
          value={payload.energy}
          error={visibleErrors.energy}
          onChange={(value) => setField("energy", value)}
          options={CAR_ENERGY_OPTIONS}
        />
      </motion.div>

      <motion.div variants={fadeUp} className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        {onCancel ? (
          <motion.button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            whileTap={!isSaving ? tapScale : undefined}
            className="cursor-pointer rounded-2xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 disabled:cursor-not-allowed dark:border-zinc-800 dark:text-zinc-200"
          >
            Annuler
          </motion.button>
        ) : null}
        <motion.button
          type="submit"
          disabled={isSaving}
          whileTap={!isSaving ? tapScale : undefined}
          className="cursor-pointer rounded-2xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-600 dark:disabled:bg-zinc-800"
        >
          {isSaving ? "Enregistrement…" : vehicle ? "Mettre à jour" : "Ajouter le véhicule"}
        </motion.button>
      </motion.div>
    </motion.form>
  )
}

function Input({
  label,
  value,
  error,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string
  value: string
  error?: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{label}</span>
      <input
        type={type}
        value={value}
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

function Select({
  label,
  value,
  error,
  onChange,
  options,
}: {
  label: string
  value: string
  error?: string
  onChange: (value: string) => void
  options: readonly { value: string; label: string }[]
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        className={cn(
          "mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition",
          "focus-visible:ring-2 focus-visible:ring-emerald-700/25 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50",
          error
            ? "border-rose-300 focus-visible:ring-rose-500/30 dark:border-rose-500/50"
            : "border-stone-200 dark:border-zinc-800",
        )}
      >
        <option value="">Sélectionner une énergie</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="mt-1 block text-sm text-rose-700 dark:text-rose-200">{error}</span> : null}
    </label>
  )
}
