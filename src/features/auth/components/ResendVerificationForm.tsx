import { useState } from "react"
import { resendVerificationEmail } from "@/features/auth/api/resendVerification"

type Props = {
  initialEmail?: string
  compact?: boolean
}

const ringOffset =
  "focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950"

export default function ResendVerificationForm({ initialEmail = "", compact = false }: Props) {
  const [email, setEmail] = useState(initialEmail)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === "loading") return
    const trimmed = email.trim()
    if (!trimmed) {
      setErrorMessage("Indiquez votre adresse email.")
      setStatus("error")
      return
    }
    setStatus("loading")
    setErrorMessage(null)
    try {
      await resendVerificationEmail({ email: trimmed.toLowerCase() })
      setStatus("success")
    } catch (err) {
      setStatus("error")
      if (err instanceof Error) {
        try {
          const parsed = JSON.parse(err.message) as { message?: string }
          setErrorMessage(parsed.message ?? "Une erreur est survenue.")
        } catch {
          setErrorMessage(err.message || "Une erreur est survenue.")
        }
      } else {
        setErrorMessage("Une erreur est survenue.")
      }
    }
  }

  return (
    <form onSubmit={onSubmit} className={compact ? "space-y-3" : "space-y-4"}>
      <div>
        <label htmlFor="resend-email" className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
          Email
        </label>
        <input
          id="resend-email"
          name="resend-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          inputMode="email"
          className={[
            "mt-2 w-full rounded-2xl border bg-white/80 px-4 py-3 text-sm outline-none transition-colors duration-200",
            "border-stone-200/80 text-zinc-900 placeholder:text-zinc-400",
            "focus-visible:ring-2 focus-visible:ring-emerald-700/35",
            ringOffset,
            "dark:border-zinc-700/80 dark:bg-zinc-950/40 dark:text-zinc-100 dark:placeholder:text-zinc-500",
          ].join(" ")}
          placeholder="vous@email.com"
        />
      </div>
      {errorMessage ? (
        <p className="text-sm text-rose-700 dark:text-rose-200" role="alert">
          {errorMessage}
        </p>
      ) : null}
      {status === "success" ? (
        <p className="text-sm text-emerald-800 dark:text-emerald-200" role="status">
          Si un compte non vérifié existe avec cet email, un nouvel email a été envoyé. Pensez à vérifier vos spams.
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === "loading"}
        className={[
          "inline-flex w-full items-center justify-center rounded-2xl border border-emerald-800/25 bg-white/80 px-5 py-3 text-sm font-semibold text-emerald-900",
          "outline-none transition-[background-color,transform,box-shadow] duration-300 hover:bg-emerald-50",
          "focus-visible:ring-2 focus-visible:ring-emerald-700/40 active:scale-[0.99]",
          "disabled:pointer-events-none disabled:opacity-60",
          ringOffset,
          "dark:border-emerald-500/30 dark:bg-zinc-900/50 dark:text-emerald-100 dark:hover:bg-emerald-950/40",
        ].join(" ")}
      >
        {status === "loading" ? "Envoi en cours…" : "Renvoyer l’email de confirmation"}
      </button>
    </form>
  )
}
