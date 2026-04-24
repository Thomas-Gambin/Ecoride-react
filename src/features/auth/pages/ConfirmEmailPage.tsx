import { useEffect, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import { verifyEmail } from "@/features/auth/api/verifyEmail"
import ResendVerificationForm from "@/features/auth/components/ResendVerificationForm"

type Phase = "loading" | "success" | "missing" | "error" | "expired"

export default function ConfirmEmailPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [phase, setPhase] = useState<Phase>("loading")
  const [errorDetail, setErrorDetail] = useState<string | null>(null)

  const token = searchParams.get("token")?.trim() ?? ""

  useEffect(() => {
    if (!token) {
      setPhase("missing")
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        await verifyEmail({ token })
        if (!cancelled) {
          setPhase("success")
          window.setTimeout(() => navigate("/login", { replace: true }), 4000)
        }
      } catch (err) {
        if (cancelled) return
        if (err instanceof Error) {
          try {
            const parsed = JSON.parse(err.message) as { code?: string; message?: string }
            if (parsed.code === "TOKEN_EXPIRED") {
              setPhase("expired")
              setErrorDetail(parsed.message ?? "Le lien a expiré.")
              return
            }
            setPhase("error")
            setErrorDetail(parsed.message ?? "Lien invalide ou expiré.")
          } catch {
            setPhase("error")
            setErrorDetail("Une erreur est survenue.")
          }
        } else {
          setPhase("error")
          setErrorDetail("Une erreur est survenue.")
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [token, navigate])

  const ringOffset =
    "focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950"

  return (
    <main className="mx-auto w-full max-w-lg px-6 py-14 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-3xl border border-stone-200/80 bg-white/70 p-8 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/40 dark:shadow-[0_1px_0_rgba(0,0,0,0.25)_inset]"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-900/70 dark:text-emerald-200/70">
          EcoRide
        </p>

        {phase === "loading" ? (
          <>
            <h1 className="mt-4 text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Vérification en cours…
            </h1>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
              Nous confirmons votre adresse email, merci de patienter un instant.
            </p>
            <div className="mt-8 flex justify-center">
              <span
                className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-700/30 border-t-emerald-600 dark:border-emerald-400/25 dark:border-t-emerald-300"
                aria-hidden
              />
            </div>
          </>
        ) : null}

        {phase === "success" ? (
          <>
            <h1 className="mt-4 text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Votre compte est confirmé
            </h1>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
              Vous pouvez maintenant vous connecter. Redirection automatique vers la page de connexion…
            </p>
            <Link
              to="/login"
              className={[
                "mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-emerald-800 px-5 py-3 text-sm font-semibold text-white",
                "shadow-[0_1px_0_rgba(255,255,255,0.12)_inset] outline-none transition-[background-color,transform] duration-300",
                "hover:bg-emerald-900 focus-visible:ring-2 focus-visible:ring-emerald-700/40 active:scale-[0.99]",
                ringOffset,
                "dark:bg-emerald-700 dark:hover:bg-emerald-600",
              ].join(" ")}
            >
              Se connecter
            </Link>
          </>
        ) : null}

        {phase === "missing" ? (
          <>
            <h1 className="mt-4 text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Lien incomplet
            </h1>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
              Ce lien ne contient pas les informations nécessaires. Utilisez le lien reçu par email ou demandez un nouvel
              envoi.
            </p>
            <div className="mt-8">
              <ResendVerificationForm />
            </div>
            <Link
              to="/login"
              className="mt-6 inline-flex w-full items-center justify-center rounded-2xl border border-stone-200/80 px-5 py-3 text-sm font-semibold text-zinc-800 hover:bg-stone-50 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-800/50"
            >
              Retour à la connexion
            </Link>
          </>
        ) : null}

        {phase === "expired" || phase === "error" ? (
          <>
            <h1 className="mt-4 text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              {phase === "expired" ? "Lien expiré" : "Confirmation impossible"}
            </h1>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
              {errorDetail ?? "Une erreur est survenue."}
            </p>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">
              Vous pouvez demander un nouvel email de confirmation ci-dessous.
            </p>
            <div className="mt-6">
              <ResendVerificationForm />
            </div>
            <Link
              to="/register-success"
              className="mt-4 inline-block text-sm font-semibold text-emerald-800 underline-offset-4 hover:underline dark:text-emerald-200"
            >
              Page d’aide après inscription
            </Link>
            <Link
              to="/login"
              className="mt-6 block w-full rounded-2xl border border-stone-200/80 py-3 text-center text-sm font-semibold text-zinc-800 hover:bg-stone-50 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-800/50"
            >
              Retour à la connexion
            </Link>
          </>
        ) : null}
      </motion.div>
    </main>
  )
}
