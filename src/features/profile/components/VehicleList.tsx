import { Plus, Trash2 } from "lucide-react"
import SoftCard from "@/features/homePage/components/SoftCard"
import type { Vehicle, VehiclePayload } from "@/features/profile/types/profile"
import { VehicleForm } from "./VehicleForm"

type FieldErrors = Partial<Record<keyof VehiclePayload | "form", string>>

type VehicleListProps = {
  vehicles: Vehicle[]
  editingVehicle: Vehicle | null
  isAdding: boolean
  isSaving: boolean
  serverErrors?: FieldErrors
  onStartAdd: () => void
  onEdit: (vehicle: Vehicle) => void
  onCancelForm: () => void
  onSubmit: (payload: VehiclePayload) => void
  onDelete: (vehicle: Vehicle) => void
}

export function VehicleList({
  vehicles,
  editingVehicle,
  isAdding,
  isSaving,
  serverErrors,
  onStartAdd,
  onEdit,
  onCancelForm,
  onSubmit,
  onDelete,
}: VehicleListProps) {
  const showForm = isAdding || editingVehicle

  return (
    <SoftCard>
      <section className="p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
              Véhicules
            </p>
            <h2 className="mt-2 text-xl font-bold text-zinc-950 dark:text-zinc-50">Gérer mes véhicules</h2>
          </div>
          <button
            type="button"
            onClick={onStartAdd}
            disabled={isSaving}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-600 dark:disabled:bg-zinc-800"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Ajouter
          </button>
        </div>

        {vehicles.length === 0 ? (
          <p className="mt-5 rounded-3xl border border-dashed border-stone-300 p-5 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-300">
            Aucun véhicule enregistré. Ajoute au moins un véhicule valide pour activer un profil chauffeur.
          </p>
        ) : (
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {vehicles.map((vehicle) => (
              <article
                key={vehicle.id}
                className="rounded-3xl border border-stone-200 bg-white/60 p-5 dark:border-zinc-800 dark:bg-zinc-950/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">
                      {vehicle.brand} {vehicle.model}
                    </h3>
                    <p className="mt-1 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
                      {vehicle.registrationNumber}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDelete(vehicle)}
                    disabled={isSaving}
                    className="cursor-pointer rounded-2xl p-2 text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-rose-200 dark:hover:bg-rose-500/10"
                    aria-label={`Supprimer ${vehicle.brand} ${vehicle.model}`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <VehicleMeta label="Couleur" value={vehicle.color} />
                  <VehicleMeta label="Énergie" value={vehicle.energy} />
                  <VehicleMeta label="Places" value={`${vehicle.seatsAvailable}`} />
                  <VehicleMeta label="1re immatriculation" value={vehicle.firstRegistrationDate} />
                </dl>
                <button
                  type="button"
                  onClick={() => onEdit(vehicle)}
                  disabled={isSaving}
                  className="mt-4 cursor-pointer rounded-2xl border border-stone-200 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-stone-50 disabled:cursor-not-allowed dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
                >
                  Modifier
                </button>
              </article>
            ))}
          </div>
        )}

        {showForm ? (
          <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50/50 p-5 dark:border-emerald-700/40 dark:bg-emerald-500/10">
            <h3 className="mb-4 text-lg font-bold text-zinc-950 dark:text-zinc-50">
              {editingVehicle ? "Modifier le véhicule" : "Ajouter un véhicule"}
            </h3>
            <VehicleForm
              key={editingVehicle ? `edit-${editingVehicle.id}` : "create"}
              vehicle={editingVehicle}
              isSaving={isSaving}
              serverErrors={serverErrors}
              onSubmit={onSubmit}
              onCancel={onCancelForm}
            />
          </div>
        ) : null}
      </section>
    </SoftCard>
  )
}

function VehicleMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</dt>
      <dd className="mt-1 font-semibold text-zinc-900 dark:text-zinc-100">{value}</dd>
    </div>
  )
}
