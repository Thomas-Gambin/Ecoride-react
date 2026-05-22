import { useState, type FormEvent } from "react"
import type { Vehicle, VehiclePayload } from "@/features/profile/types/profile"
import { cn } from "@/shared/lib/utils"

type FieldErrors = Partial<Record<keyof VehiclePayload | "form", string>>

const emptyVehiclePayload: VehiclePayload = {
  registrationNumber: "",
  firstRegistrationDate: "",
  brand: "",
  model: "",
  color: "",
  energy: "",
  seatsAvailable: 1,
}

function toPayload(vehicle?: Vehicle | null): VehiclePayload {
  if (!vehicle) return emptyVehiclePayload

  return {
    registrationNumber: vehicle.registrationNumber,
    firstRegistrationDate: vehicle.firstRegistrationDate,
    brand: vehicle.brand,
    model: vehicle.model,
    color: vehicle.color,
    energy: vehicle.energy,
    seatsAvailable: vehicle.seatsAvailable,
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
  if (!Number.isFinite(payload.seatsAvailable) || payload.seatsAvailable < 1) {
    errors.seatsAvailable = "Le nombre de places doit être supérieur ou égal à 1."
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
      energy: payload.energy.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {visibleErrors.form ? (
        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-200" role="alert">
          {visibleErrors.form}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
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
        <Input label="Énergie" value={payload.energy} error={visibleErrors.energy} onChange={(value) => setField("energy", value)} />
        <Input
          label="Places disponibles"
          value={String(payload.seatsAvailable)}
          error={visibleErrors.seatsAvailable}
          onChange={(value) => setField("seatsAvailable", Number(value))}
          type="number"
          min={1}
          hint="Ce nombre servira plus tard lors de la création d’un trajet."
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="cursor-pointer rounded-2xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-stone-50 disabled:cursor-not-allowed dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            Annuler
          </button>
        ) : null}
        <button
          type="submit"
          disabled={isSaving}
          className="cursor-pointer rounded-2xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-600 dark:disabled:bg-zinc-800"
        >
          {isSaving ? "Enregistrement…" : vehicle ? "Mettre à jour" : "Ajouter le véhicule"}
        </button>
      </div>
    </form>
  )
}

function Input({
  label,
  value,
  error,
  hint,
  onChange,
  type = "text",
  min,
  placeholder,
}: {
  label: string
  value: string
  error?: string
  hint?: string
  onChange: (value: string) => void
  type?: string
  min?: number
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{label}</span>
      <input
        type={type}
        min={min}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        className={cn(
          "mt-2 w-full rounded-2xl border bg-white/80 px-4 py-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400",
          "focus-visible:ring-2 focus-visible:ring-emerald-700/25 dark:bg-zinc-950/50 dark:text-zinc-50",
          error
            ? "border-rose-300 focus-visible:ring-rose-500/30 dark:border-rose-500/50"
            : "border-stone-200 dark:border-zinc-800",
        )}
      />
      {hint ? <span className="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">{hint}</span> : null}
      {error ? <span className="mt-1 block text-sm text-rose-700 dark:text-rose-200">{error}</span> : null}
    </label>
  )
}
