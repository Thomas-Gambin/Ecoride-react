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

export default function PasswordStrength({ password }: { password: string }) {
  const { score } = useMemo(() => scorePassword(password), [password])
  const ui = useMemo(() => label(score), [score])

  if (!password) return null

  const percent = Math.round((score / 5) * 100)

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
          Sécurité du mot de passe
        </p>
        <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">
          {ui.text}
        </p>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-200/70 dark:bg-zinc-800/70">
        <div
          className={`h-full ${ui.color} transition-[width] duration-300`}
          style={{ width: `${percent}%` }}
          aria-hidden
        />
      </div>
    </div>
  )
}

