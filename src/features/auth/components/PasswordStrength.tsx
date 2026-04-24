import { useMemo } from "react"

function scorePassword(password: string) {
  const rules = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasDigit: /\d/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  }
  const score = Object.values(rules).filter(Boolean).length
  return { score, rules }
}

function label(score: number) {
  if (score <= 1) return { text: "Très faible", color: "bg-rose-500" }
  if (score === 2) return { text: "Faible", color: "bg-orange-500" }
  if (score === 3) return { text: "Moyen", color: "bg-amber-500" }
  if (score === 4) return { text: "Bon", color: "bg-emerald-500" }
  return { text: "Fort", color: "bg-emerald-600" }
}

const REQUIREMENTS: { key: keyof ReturnType<typeof scorePassword>["rules"]; label: string }[] = [
  { key: "minLength", label: "Au moins 8 caractères" },
  { key: "hasUpper", label: "Une majuscule" },
  { key: "hasLower", label: "Une minuscule" },
  { key: "hasDigit", label: "Un chiffre" },
  { key: "hasSpecial", label: "Un caractère spécial" },
]

export default function PasswordStrength({ password }: { password: string }) {
  const { score, rules } = useMemo(() => scorePassword(password), [password])
  const ui = useMemo(() => label(score), [score])

  const percent = Math.round((score / 5) * 100)

  return (
    <div className="mt-3 space-y-3" aria-live="polite">
      <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">Exigences du mot de passe</p>
      <ul className="space-y-1.5">
        {REQUIREMENTS.map(({ key, label: reqLabel }) => {
          const ok = rules[key]
          return (
            <li key={key} className="flex items-center gap-2 text-xs">
              <span
                className={[
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold leading-none",
                  ok
                    ? "bg-emerald-600 text-white dark:bg-emerald-500"
                    : "border border-zinc-300 bg-zinc-100 text-transparent dark:border-zinc-600 dark:bg-zinc-800",
                ].join(" ")}
                aria-hidden
              >
                ✓
              </span>
              <span
                className={
                  ok ? "font-medium text-emerald-800 dark:text-emerald-200" : "text-zinc-600 dark:text-zinc-400"
                }
              >
                {reqLabel}
              </span>
            </li>
          )
        })}
      </ul>

      {password.length > 0 ? (
        <div>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">Sécurité du mot de passe</p>
            <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">{ui.text}</p>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-200/70 dark:bg-zinc-800/70">
            <div
              className={`h-full ${ui.color} transition-[width] duration-300`}
              style={{ width: `${percent}%` }}
              aria-hidden
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}
