import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react"
import { createPortal } from "react-dom"
import { formatCommuneLabel, primaryPostalCode, searchCommunes, type GeoCommune } from "@/shared/api/geoCommunes"
import type { CommuneSelection } from "@/features/rides/types/createCarpool"
import { cn } from "@/shared/lib/utils"

type CityAutocompleteProps = {
  label: string
  value: string
  selected: CommuneSelection | null
  onChange: (value: string) => void
  onSelect: (commune: CommuneSelection | null) => void
  error?: string
}

const DEBOUNCE_MS = 300

type DropdownPosition = Pick<CSSProperties, "top" | "left" | "width">

export function CityAutocomplete({ label, value, selected, onChange, onSelect, error }: CityAutocompleteProps) {
  const listId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [suggestions, setSuggestions] = useState<GeoCommune[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition | null>(null)

  useEffect(() => {
    if (value.trim().length < 2) {
      setSuggestions([])
      setIsOpen(false)
      setApiError(null)
      return
    }

    if (selected && value === selected.name) {
      setSuggestions([])
      setIsOpen(false)
      return
    }

    const controller = new AbortController()
    const timeout = window.setTimeout(async () => {
      setIsLoading(true)
      setApiError(null)

      try {
        const results = await searchCommunes(value, controller.signal)
        setSuggestions(results)
        setIsOpen(true)
        setActiveIndex(results.length > 0 ? 0 : -1)
      } catch (fetchError) {
        if (controller.signal.aborted) return
        setSuggestions([])
        setIsOpen(false)
        setApiError(fetchError instanceof Error ? fetchError.message : "Erreur lors de la recherche.")
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }, DEBOUNCE_MS)

    return () => {
      controller.abort()
      window.clearTimeout(timeout)
    }
  }, [value, selected])

  useEffect(() => {
    if (!isOpen) {
      setDropdownPosition(null)
      return
    }

    const updatePosition = () => {
      const input = inputRef.current
      if (!input) return

      const rect = input.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
      })
    }

    updatePosition()
    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", updatePosition, true)

    return () => {
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition, true)
    }
  }, [isOpen, suggestions.length])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (containerRef.current?.contains(target) || listRef.current?.contains(target)) {
        return
      }

      setIsOpen(false)
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleInputChange = (nextValue: string) => {
    onChange(nextValue)
    if (selected && nextValue !== selected.name) {
      onSelect(null)
    }
  }

  const handleSelect = (commune: GeoCommune) => {
    const selection: CommuneSelection = {
      name: commune.nom,
      code: commune.code,
      postalCode: primaryPostalCode(commune),
      postalCodes: commune.codesPostaux,
    }
    onChange(commune.nom)
    onSelect(selection)
    setSuggestions([])
    setIsOpen(false)
    setActiveIndex(-1)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return

    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveIndex((current) => (current + 1) % suggestions.length)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((current) => (current - 1 + suggestions.length) % suggestions.length)
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault()
      handleSelect(suggestions[activeIndex])
    } else if (event.key === "Escape") {
      setIsOpen(false)
    }
  }

  const visibleError = error ?? apiError

  return (
    <div ref={containerRef} className="relative">
      <label className="block">
        <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{label}</span>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(event) => handleInputChange(event.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true)
          }}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-invalid={Boolean(visibleError)}
          autoComplete="off"
          className={cn(
            "mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400",
            "focus-visible:ring-2 focus-visible:ring-emerald-700/25 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50",
            visibleError
              ? "border-rose-300 focus-visible:ring-rose-500/30 dark:border-rose-500/50"
              : "border-stone-200 dark:border-zinc-800",
          )}
          placeholder="Saisir une commune…"
        />
      </label>

      {isLoading ? (
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Recherche en cours…</p>
      ) : null}

      {visibleError ? (
        <span className="mt-1 block text-sm text-rose-700 dark:text-rose-200">{visibleError}</span>
      ) : null}

      {isOpen && !isLoading && dropdownPosition
        ? createPortal(
            <ul
              ref={listRef}
              id={listId}
              role="listbox"
              style={{
                position: "fixed",
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
                zIndex: 50,
              }}
              className="max-h-60 overflow-auto rounded-2xl border border-stone-200 bg-white py-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
            >
              {suggestions.length === 0 ? (
                <li className="px-4 py-2 text-sm text-zinc-500 dark:text-zinc-400">Aucune commune trouvée.</li>
              ) : (
                suggestions.map((commune, index) => (
                  <li key={commune.code} role="presentation">
                    <button
                      type="button"
                      role="option"
                      aria-selected={index === activeIndex}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => handleSelect(commune)}
                      className={cn(
                        "w-full px-4 py-2 text-left text-sm text-zinc-800 dark:text-zinc-100",
                        index === activeIndex ? "bg-emerald-50 dark:bg-emerald-500/10" : "hover:bg-zinc-50 dark:hover:bg-zinc-800",
                      )}
                    >
                      {formatCommuneLabel(commune)}
                    </button>
                  </li>
                ))
              )}
            </ul>,
            document.body,
          )
        : null}
    </div>
  )
}
