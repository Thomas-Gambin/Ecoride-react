import { AnimatePresence, motion } from "framer-motion"
import { Plus, Trash2 } from "lucide-react"
import SoftCard from "@/features/homePage/components/SoftCard"
import type { Vehicle, VehiclePayload } from "@/features/profile/types/profile"
import { scaleIn, staggerItems, tapScale } from "@/features/profile/lib/motion"
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
    <SoftCard interactive={false}>
      <section className="p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
              Véhicules
            </p>
            <h2 className="mt-2 text-xl font-bold text-zinc-950 dark:text-zinc-50">Gérer mes véhicules</h2>
          </div>
          <motion.button
            type="button"
            onClick={onStartAdd}
            disabled={isSaving}
            whileTap={!isSaving ? tapScale : undefined}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-600 dark:disabled:bg-zinc-800"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Ajouter
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {vehicles.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="mt-5 rounded-3xl border border-dashed border-stone-300 p-5 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-300"
            >
              Aucun véhicule enregistré. Ajoute au moins un véhicule valide pour activer un profil chauffeur.
            </motion.p>
          ) : (
            <motion.div
              key="list"
              className="mt-5 grid gap-4 lg:grid-cols-2"
              variants={staggerItems}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence mode="popLayout">
                {vehicles.map((vehicle) => (
                  <motion.article
                    key={vehicle.id}
                    layout
                    variants={scaleIn}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.22 } }}
                    className="rounded-3xl border border-stone-200 p-5 dark:border-zinc-800"
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
                      <motion.button
                        type="button"
                        onClick={() => onDelete(vehicle)}
                        disabled={isSaving}
                        whileTap={!isSaving ? { scale: 0.9 } : undefined}
                        className="cursor-pointer rounded-2xl p-2 text-rose-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-rose-200"
                        aria-label={`Supprimer ${vehicle.brand} ${vehicle.model}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </motion.button>
                    </div>
                    <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <VehicleMeta label="Couleur" value={vehicle.color} />
                      <VehicleMeta label="Énergie" value={vehicle.energy} />
                      <VehicleMeta label="1re immatriculation" value={vehicle.firstRegistrationDate} />
                    </dl>
                    <motion.button
                      type="button"
                      onClick={() => onEdit(vehicle)}
                      disabled={isSaving}
                      whileTap={!isSaving ? tapScale : undefined}
                      className="mt-4 cursor-pointer rounded-2xl border border-stone-200 px-4 py-2 text-sm font-semibold text-zinc-700 disabled:cursor-not-allowed dark:border-zinc-800 dark:text-zinc-200"
                    >
                      Modifier
                    </motion.button>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showForm ? (
            <motion.div
              key={editingVehicle ? `form-${editingVehicle.id}` : "form-create"}
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 24 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-700/40 dark:bg-emerald-500/10">
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
            </motion.div>
          ) : null}
        </AnimatePresence>
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
