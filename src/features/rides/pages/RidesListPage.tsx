import { useMemo, useState } from "react"
import Footer from "@/shared/components/layout/Footer"
import { MOCK_RIDES } from "../data/mockRides"
import { filterRides } from "../utils/filterRides"
import { hasActiveSearchParams, searchRides } from "../utils/searchRides"
import { RideCard } from "../components/RideCard"
import { RideFilters } from "../components/RideFilters"
import { RideSearchForm } from "../components/RideSearchForm"
import { RidesEmptyState } from "../components/RidesEmptyState"
import { DEFAULT_RIDE_FILTERS, type RideFiltersState, type RideSearchParams } from "../types/ride"

const EMPTY_FORM: RideSearchParams = { departure: "", arrival: "", date: "" }

function formatSearchLabel(params: RideSearchParams): string | null {
  const parts: string[] = []
  if (params.departure.trim()) parts.push(params.departure.trim())
  if (params.arrival.trim()) parts.push(params.arrival.trim())
  if (parts.length === 2) return `${parts[0]} → ${parts[1]}`
  if (parts.length === 1) return parts[0]
  if (params.date.trim()) {
    const [y, m, d] = params.date.split("-").map(Number)
    if (y && m && d) {
      return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(
        new Date(y, m - 1, d)
      )
    }
  }
  return null
}

export default function RidesListPage() {
  const [formValues, setFormValues] = useState<RideSearchParams>(EMPTY_FORM)
  const [searchParams, setSearchParams] = useState<RideSearchParams>(EMPTY_FORM)
  const [baseResults, setBaseResults] = useState(() => searchRides(MOCK_RIDES, EMPTY_FORM))
  const [filters, setFilters] = useState<RideFiltersState>(DEFAULT_RIDE_FILTERS)

  const displayedRides = useMemo(() => filterRides(baseResults, filters), [baseResults, filters])
  const activeSearch = hasActiveSearchParams(searchParams)
  const searchLabel = activeSearch ? formatSearchLabel(searchParams) : null

  const handleSearch = (params: RideSearchParams) => {
    setFormValues(params)
    setSearchParams(params)
    setBaseResults(searchRides(MOCK_RIDES, params))
    setFilters(DEFAULT_RIDE_FILTERS)
  }

  const handleResetSearch = () => {
    handleSearch(EMPTY_FORM)
  }

  const showNoResults = baseResults.length === 0
  const showNoFilterMatch = baseResults.length > 0 && displayedRides.length === 0
  const showResults = displayedRides.length > 0

  return (
    <>
      <main className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[320px] bg-gradient-to-b from-emerald-50/90 via-lime-50/40 to-transparent dark:from-emerald-950/40 dark:via-zinc-950/20 dark:to-transparent"
          aria-hidden
        />

        <div className="relative mx-auto w-full max-w-6xl px-6 py-10">
          <header className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
              Covoiturages
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">
              Trouver un covoiturage
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 sm:text-base">
              Parcourez les trajets disponibles, affinez avec la recherche et les filtres.
            </p>
          </header>

          <div className="mt-8">
            <RideSearchForm values={formValues} onValuesChange={setFormValues} onSubmit={handleSearch} />
            {activeSearch ? (
              <button
                type="button"
                onClick={handleResetSearch}
                className="mt-3 text-sm font-semibold text-emerald-800 underline-offset-2 hover:underline dark:text-emerald-300"
              >
                Afficher tous les covoiturages
              </button>
            ) : null}
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
            <RideFilters filters={filters} onChange={setFilters} className="h-fit lg:sticky lg:top-24" />

            <section aria-live="polite" aria-label="Covoiturages disponibles">
              {showNoResults ? <RidesEmptyState variant="no-results" /> : null}
              {showNoFilterMatch ? <RidesEmptyState variant="no-filter-match" /> : null}

              {showResults ? (
                <>
                  <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-300">
                    {displayedRides.length} trajet{displayedRides.length > 1 ? "s" : ""} affiché
                    {displayedRides.length > 1 ? "s" : ""}
                    {searchLabel ? (
                      <>
                        {" "}
                        — <span className="font-semibold text-zinc-800 dark:text-zinc-100">{searchLabel}</span>
                      </>
                    ) : (
                      <> sur {MOCK_RIDES.length} au total</>
                    )}
                  </p>
                  <ul className="grid gap-4">
                    {displayedRides.map((ride) => (
                      <li key={ride.id}>
                        <RideCard ride={ride} />
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
