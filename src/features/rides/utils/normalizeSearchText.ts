export function normalizeSearchText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
}

export function matchesCity(query: string, city: string): boolean {
  const normalizedQuery = normalizeSearchText(query)
  const normalizedCity = normalizeSearchText(city)
  if (!normalizedQuery) return false
  return normalizedCity.includes(normalizedQuery) || normalizedQuery.includes(normalizedCity)
}
