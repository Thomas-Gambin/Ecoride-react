import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { loginUser } from "@/features/auth/api/login"

type FieldErrors = Partial<Record<"email" | "password" | "form", string>>

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function LoginPage() {
  const location = useLocation()
  const prefilledEmail = (location.state as { email?: string } | null)?.email ?? ""

  const [email, setEmail] = useState(prefilledEmail)
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<FieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loggedInMessage, setLoggedInMessage] = useState<string | null>(null)

  const ringOffset =
    "focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950"

  const validate = (): FieldErrors => {
    const next: FieldErrors = {}
    const e = email.trim()
    if (!e) next.email = "L’email est obligatoire."
    else if (!isValidEmail(e)) next.email = "L’email n’est pas valide."
    if (!password) next.password = "Le mot de passe est obligatoire."
    return next
  }

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (isSubmitting) return
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    setErrors({})
    setLoggedInMessage(null)
    try {
      const res = await loginUser({ email: email.trim().toLowerCase(), password })
      setLoggedInMessage(res.message)
    } catch (err) {
      if (err instanceof Error) {
        try {
          const parsed = JSON.parse(err.message) as { message?: string; code?: string }
          if (parsed.code === "EMAIL_NOT_VERIFIED") {
            setErrors({
              form:
                parsed.message ??
                "Votre compte n’est pas encore vérifié. Veuillez confirmer votre adresse email.",
            })
          } else {
            setErrors({ form: parsed.message ?? "Identifiants invalides." })
          }
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

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14 sm:py-16">
      <div className="grid items-stretch gap-8 md:grid-cols-2">
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl border border-stone-200/80 bg-white/70 p-7 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/40 dark:shadow-[0_1px_0_rgba(0,0,0,0.25)_inset]"
        >
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">Connexion</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Pas encore de compte ?{" "}
            <Link
              className="font-semibold text-emerald-800 underline-offset-4 hover:underline dark:text-emerald-200"
              to="/register"
            >
              Créer un compte
            </Link>
          </p>

          {loggedInMessage ? (
            <div className="mt-5 rounded-2xl border border-emerald-200/70 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-50">
              {loggedInMessage}
            </div>
          ) : null}

          {errors.form ? (
            <div className="mt-5 rounded-2xl border border-rose-200/70 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-100">
              <p>{errors.form}</p>
              {errors.form.includes("pas encore vérifié") ? (
                <Link
                  to="/register-success"
                  state={{ email: email.trim().toLowerCase() }}
                  className="mt-3 inline-block font-semibold text-emerald-900 underline-offset-4 hover:underline dark:text-emerald-100"
                >
                  Renvoyer l’email de confirmation
                </Link>
              ) : null}
            </div>
          ) : null}

          <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
            <div>
              <label htmlFor="login-email" className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                Email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                inputMode="email"
                aria-invalid={Boolean(errors.email)}
                className={[
                  "mt-2 w-full rounded-2xl border bg-white/80 px-4 py-3 text-sm outline-none transition-colors duration-200",
                  "border-stone-200/80 text-zinc-900 placeholder:text-zinc-400",
                  "focus-visible:ring-2 focus-visible:ring-emerald-700/35",
                  ringOffset,
                  "dark:border-zinc-700/80 dark:bg-zinc-950/40 dark:text-zinc-100 dark:placeholder:text-zinc-500",
                  errors.email ? "border-rose-300 focus-visible:ring-rose-500/30 dark:border-rose-500/40" : "",
                ].join(" ")}
                placeholder="vous@email.com"
              />
              {errors.email ? <p className="mt-2 text-sm text-rose-700 dark:text-rose-200">{errors.email}</p> : null}
            </div>
            <div>
              <label htmlFor="login-password" className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                Mot de passe
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
                className={[
                  "mt-2 w-full rounded-2xl border bg-white/80 px-4 py-3 text-sm outline-none transition-colors duration-200",
                  "border-stone-200/80 text-zinc-900 placeholder:text-zinc-400",
                  "focus-visible:ring-2 focus-visible:ring-emerald-700/35",
                  ringOffset,
                  "dark:border-zinc-700/80 dark:bg-zinc-950/40 dark:text-zinc-100 dark:placeholder:text-zinc-500",
                  errors.password ? "border-rose-300 focus-visible:ring-rose-500/30 dark:border-rose-500/40" : "",
                ].join(" ")}
                placeholder="••••••••"
              />
              {errors.password ? (
                <p className="mt-2 text-sm text-rose-700 dark:text-rose-200">{errors.password}</p>
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
              {isSubmitting ? "Connexion…" : "Se connecter"}
            </button>
          </form>
        </motion.section>

        <section className="rounded-3xl border border-stone-200/80 bg-gradient-to-br from-emerald-600/10 via-emerald-500/5 to-lime-400/10 p-7 dark:border-zinc-800/80 dark:from-emerald-500/12 dark:via-emerald-400/6 dark:to-lime-400/10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-900/70 dark:text-emerald-200/70">
            EcoRide
          </p>
          <h2 className="mt-3 text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            20 crédits offerts à l’inscription
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
            Rejoins une communauté qui voyage plus responsable. Partage tes trajets, économise, et réduis ton impact.
          </p>
        </section>
      </div>
    </main>
  )
}
