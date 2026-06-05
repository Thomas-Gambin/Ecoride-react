const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  weekday: "short",
  day: "numeric",
  month: "long",
  year: "numeric",
})

export function formatRideDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number)
  if (!year || !month || !day) return isoDate
  return dateFormatter.format(new Date(year, month - 1, day))
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins} min`
  if (mins === 0) return `${hours} h`
  return `${hours} h ${mins} min`
}

export function formatPrice(credits: number): string {
  return `${credits} crédit${credits > 1 ? "s" : ""}`
}

export function formatRating(rating: number): string {
  return rating.toFixed(1)
}
