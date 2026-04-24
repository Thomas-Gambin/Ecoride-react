import { Link, useLocation, useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import ResendVerificationForm from "@/features/auth/components/ResendVerificationForm"

export default function RegisterSuccessPage() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const stateEmail = (location.state as { email?: string } | null)?.email
  const queryEmail = searchParams.get("email") ?? ""
  const initialEmail = stateEmail ?? queryEmail

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14 sm:py-16">
      <div className="grid items-stretch gap-8 md:grid-cols-2">
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl border border-stone-200/80 bg-gradient-to-br from-emerald-600/10 via-emerald-500/5 to-lime-400/10 p-7 dark:border-zinc-800/80 dark:from-emerald-500/12 dark:via-emerald-400/6 dark:to-lime-400/10"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-900/70 dark:text-emerald-200/70">
            EcoRide
          </p>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Presque terminé
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
            Il ne reste plus qu’à confirmer ton adresse email pour activer ton compte et profiter de tes crédits de
            bienvenue.
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl border border-stone-200/80 bg-white/70 p-7 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/40 dark:shadow-[0_1px_0_rgba(0,0,0,0.25)_inset]"
        >
          <h2 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Confirmez votre adresse email
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            Un email de confirmation vous a été envoyé. Cliquez sur le lien présent dans cet email pour activer votre
            compte.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            Pensez à vérifier vos <span className="font-semibold text-zinc-800 dark:text-zinc-100">courriers indésirables</span>{" "}
            (dossier spam) si le message n’apparaît pas dans votre boîte de réception.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              to="/login"
              className="inline-flex flex-1 items-center justify-center rounded-2xl bg-emerald-800 px-5 py-3 text-center text-sm font-semibold text-white shadow-[0_1px_0_rgba(255,255,255,0.12)_inset] outline-none transition-[background-color,transform] duration-300 hover:bg-emerald-900 focus-visible:ring-2 focus-visible:ring-emerald-700/40 active:scale-[0.99] dark:bg-emerald-700 dark:hover:bg-emerald-600"
            >
              Retour à la connexion
            </Link>
          </div>

          <div className="mt-10 border-t border-stone-200/80 pt-8 dark:border-zinc-700/80">
            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Renvoyer l’email de confirmation</p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Saisissez l’adresse utilisée à l’inscription si le champ n’est pas prérempli.
            </p>
            <div className="mt-4">
              <ResendVerificationForm initialEmail={initialEmail} />
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  )
}
