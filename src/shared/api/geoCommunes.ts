export type GeoCommune = {
  nom: string
  code: string
  codesPostaux: string[]
  population?: number
}

const GEO_API_BASE = "https://geo.api.gouv.fr"
const MIN_QUERY_LENGTH = 2

export async function searchCommunes(query: string, signal?: AbortSignal): Promise<GeoCommune[]> {
  const trimmed = query.trim()
  if (trimmed.length < MIN_QUERY_LENGTH) {
    return []
  }

  const params = new URLSearchParams({
    nom: trimmed,
    boost: "population",
    limit: "10",
    fields: "nom,code,codesPostaux,population",
  })

  const response = await fetch(`${GEO_API_BASE}/communes?${params.toString()}`, { signal })

  if (!response.ok) {
    throw new Error("Impossible de charger les communes.")
  }

  const data = (await response.json()) as GeoCommune[]
  return Array.isArray(data) ? data : []
}

export function primaryPostalCode(commune: GeoCommune): string {
  return commune.codesPostaux[0] ?? ""
}

export function formatCommuneLabel(commune: GeoCommune): string {
  const postal = primaryPostalCode(commune)
  return postal ? `${commune.nom} — ${postal}` : commune.nom
}
