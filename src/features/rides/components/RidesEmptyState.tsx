import { Leaf, Search } from "lucide-react"
import { cn } from "@/shared/lib/utils"

type RidesEmptyStateVariant = "initial" | "no-results" | "no-filter-match"

const MESSAGES: Record<RidesEmptyStateVariant, { title: string; description: string }> = {
  initial: {
    title: "Aucun covoiturage affiché",
    description: "Renseignez votre trajet pour afficher les covoiturages disponibles.",
  },
  "no-results": {
    title: "Aucun trajet trouvé",
    description: "Aucun trajet disponible pour cette recherche. Essayez une autre date.",
  },
  "no-filter-match": {
    title: "Aucun trajet ne correspond",
    description: "Aucun trajet ne correspond à vos filtres. Essayez d’assouplir vos critères.",
  },
}

export function RidesEmptyState({
  variant,
  className,
}: {
  variant: RidesEmptyStateVariant
  className?: string
}) {
  const { title, description } = MESSAGES[variant]
  const Icon = variant === "initial" ? Search : Leaf

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[28px] border border-dashed px-6 py-14 text-center",
        "border-stone-300/80 bg-white/50 dark:border-zinc-700 dark:bg-zinc-900/30",
        className
      )}
      role="status"
    >
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
        <Icon className="h-6 w-6" strokeWidth={1.8} aria-hidden />
      </div>
      <h2 className="mt-4 text-lg font-bold text-zinc-900 dark:text-zinc-50">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{description}</p>
    </div>
  )
}
