import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import PasswordStrength from "@/features/auth/components/PasswordStrength"
import { registerUser } from "@/features/auth/api/register"

type FieldErrors = Partial<Record<"pseudo" | "email" | "password" | "confirmPassword" | "form", string>>

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function checkPassword(password: string) {
  const rules = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasDigit: /\d/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  }

  const score = Object.values(rules).filter(Boolean).length
  return { rules, score }
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [pseudo, setPseudo] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<FieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const pwd = useMemo(() => checkPassword(password), [password])

  const validate = (): FieldErrors => {
    const next: FieldErrors = {}
    const p = pseudo.trim()
    const e = email.trim()

    if (!p) next.pseudo = "Le pseudo est obligatoire."
    else if (p.length < 3) next.pseudo = "Le pseudo doit contenir au moins 3 caractères."
    else if (p.length > 30) next.pseudo = "Le pseudo doit contenir au maximum 30 caractères."

    if (!e) next.email = "L'email est obligatoire."
    else if (!isValidEmail(e)) next.email = "L'email n'est pas valide."

    if (!password) next.password = "Le mot de passe est obligatoire."
    else if (pwd.score < 5) next.password = "Le mot de passe n'est pas assez fort."

    if (!confirmPassword) next.confirmPassword = "La confirmation est obligatoire."
    else if (confirmPassword !== password) next.confirmPassword = "Les mots de passe ne correspondent pas."

    return next
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    try {
      await registerUser({
        pseudo: pseudo.trim(),
        email: email.trim(),
        password,
      })

      navigate("/register-success", {
        state: { email: email.trim().toLowerCase() },
        replace: false,
      })
    } catch (err) {
      if (err instanceof Error) {
        try {
          const parsed = JSON.parse(err.message) as { message?: string; fields?: Record<string, string> }
          setErrors({
            form: parsed.message ?? "Une erreur est survenue.",
            pseudo: parsed.fields?.pseudo,
            email: parsed.fields?.email,
          })
        } catch {
          setErrors({ form: err.message || "Une erreur est survenue." })
        }
      } else {
        setErrors({ form: "Une erreur est survenue." })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const ringOffset =
    "focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950"

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14 sm:py-16">
      <div className="grid items-stretch gap-8 md:grid-cols-2">
        <section className="rounded-3xl border border-stone-200/80 bg-gradient-to-br from-emerald-600/10 via-emerald-500/5 to-lime-400/10 p-7 dark:border-zinc-800/80 dark:from-emerald-500/12 dark:via-emerald-400/6 dark:to-lime-400/10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-900/70 dark:text-emerald-200/70">
            EcoRide
          </p>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Crée ton compte, roule plus responsable
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
            À l’inscription, tu reçois automatiquement <span className="font-semibold text-emerald-800 dark:text-emerald-200">20 crédits</span>{" "}
            pour commencer à voyager.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-zinc-700 dark:text-zinc-200">
            <li className="flex gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-700/70 dark:bg-emerald-300/70" />
              <span>Un pseudo public pour te reconnaître facilement.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-700/70 dark:bg-emerald-300/70" />
              <span>Un mot de passe renforcé pour protéger ton compte.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-700/70 dark:bg-emerald-300/70" />
              <span>Un email de confirmation pour activer ton compte.</span>
            </li>
          </ul>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl border border-stone-200/80 bg-white/70 p-7 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/40 dark:shadow-[0_1px_0_rgba(0,0,0,0.25)_inset]"
        >
          <h2 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Créer un compte
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            Déjà inscrit ?{" "}
            <Link className="font-semibold text-emerald-800 underline-offset-4 hover:underline dark:text-emerald-200" to="/login">
              Se connecter
            </Link>
          </p>

          {errors.form ? (
            <div className="mt-5 rounded-2xl border border-rose-200/70 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-100">
              {errors.form}
            </div>
          ) : null}

          <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
            <div>
              <label htmlFor="pseudo" className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                Pseudo
              </label>
              <input
                id="pseudo"
                name="pseudo"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                aria-invalid={Boolean(errors.pseudo)}
                className={[
                  "mt-2 w-full rounded-2xl border bg-white/80 px-4 py-3 text-sm outline-none transition-colors duration-200",
                  "border-stone-200/80 text-zinc-900 placeholder:text-zinc-400",
                  "focus-visible:ring-2 focus-visible:ring-emerald-700/35",
                  ringOffset,
                  "dark:border-zinc-700/80 dark:bg-zinc-950/40 dark:text-zinc-100 dark:placeholder:text-zinc-500",
                  errors.pseudo ? "border-rose-300 focus-visible:ring-rose-500/30 dark:border-rose-500/40" : "",
                ].join(" ")}
                placeholder="john"
                autoComplete="nickname"
              />
              {errors.pseudo ? <p className="mt-2 text-sm text-rose-700 dark:text-rose-200">{errors.pseudo}</p> : null}
            </div>

            <div>
              <label htmlFor="email" className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                Email
              </label>
              <input
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={Boolean(errors.email)}
                className={[
                  "mt-2 w-full rounded-2xl border bg-white/80 px-4 py-3 text-sm outline-none transition-colors duration-200",
                  "border-stone-200/80 text-zinc-900 placeholder:text-zinc-400",
                  "focus-visible:ring-2 focus-visible:ring-emerald-700/35",
                  ringOffset,
                  "dark:border-zinc-700/80 dark:bg-zinc-950/40 dark:text-zinc-100 dark:placeholder:text-zinc-500",
                  errors.email ? "border-rose-300 focus-visible:ring-rose-500/30 dark:border-rose-500/40" : "",
                ].join(" ")}
                placeholder="john@email.com"
                autoComplete="email"
                inputMode="email"
              />
              {errors.email ? <p className="mt-2 text-sm text-rose-700 dark:text-rose-200">{errors.email}</p> : null}
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={Boolean(errors.password)}
                className={[
                  "mt-2 w-full rounded-2xl border bg-white/80 px-4 py-3 text-sm outline-none transition-colors duration-200",
                  "border-stone-200/80 text-zinc-900 placeholder:text-zinc-400",
                  "focus-visible:ring-2 focus-visible:ring-emerald-700/35",
                  ringOffset,
                  "dark:border-zinc-700/80 dark:bg-zinc-950/40 dark:text-zinc-100 dark:placeholder:text-zinc-500",
                  errors.password ? "border-rose-300 focus-visible:ring-rose-500/30 dark:border-rose-500/40" : "",
                ].join(" ")}
                autoComplete="new-password"
                placeholder="••••••••"
              />
              <PasswordStrength password={password} />
              {errors.password ? <p className="mt-2 text-sm text-rose-700 dark:text-rose-200">{errors.password}</p> : null}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                Confirmation
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                aria-invalid={Boolean(errors.confirmPassword)}
                className={[
                  "mt-2 w-full rounded-2xl border bg-white/80 px-4 py-3 text-sm outline-none transition-colors duration-200",
                  "border-stone-200/80 text-zinc-900 placeholder:text-zinc-400",
                  "focus-visible:ring-2 focus-visible:ring-emerald-700/35",
                  ringOffset,
                  "dark:border-zinc-700/80 dark:bg-zinc-950/40 dark:text-zinc-100 dark:placeholder:text-zinc-500",
                  errors.confirmPassword ? "border-rose-300 focus-visible:ring-rose-500/30 dark:border-rose-500/40" : "",
                ].join(" ")}
                autoComplete="new-password"
                placeholder="••••••••"
              />
              {errors.confirmPassword ? (
                <p className="mt-2 text-sm text-rose-700 dark:text-rose-200">{errors.confirmPassword}</p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={[
                "mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-emerald-800 px-5 py-3 text-sm font-semibold text-white",
                "shadow-[0_1px_0_rgba(255,255,255,0.12)_inset] outline-none transition-[background-color,transform,box-shadow] duration-300",
                "hover:bg-emerald-900 focus-visible:ring-2 focus-visible:ring-emerald-700/40 active:scale-[0.99]",
                "disabled:pointer-events-none disabled:opacity-60",
                ringOffset,
                "dark:bg-emerald-700 dark:hover:bg-emerald-600",
              ].join(" ")}
            >
              {isSubmitting ? "Création en cours…" : "Créer mon compte"}
            </button>
          </form>
        </motion.section>
      </div>
    </main>
  )
}

