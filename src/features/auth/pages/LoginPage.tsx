import { Link } from "react-router-dom"
import { motion } from "framer-motion"

export default function LoginPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14 sm:py-16">
      <div className="grid items-stretch gap-8 md:grid-cols-2">
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl border border-stone-200/80 bg-white/70 p-7 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/40 dark:shadow-[0_1px_0_rgba(0,0,0,0.25)_inset]"
        >
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Connexion
          </h1>
          <div className="mt-6">
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-full bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_1px_0_rgba(255,255,255,0.12)_inset] outline-none transition-[background-color,transform,box-shadow] duration-300 hover:bg-emerald-900 focus-visible:ring-2 focus-visible:ring-emerald-700/40 active:scale-[0.98] dark:bg-emerald-700 dark:hover:bg-emerald-600"
            >
              Créer un compte
            </Link>
          </div>
        </motion.section>

        <section className="rounded-3xl border border-stone-200/80 bg-gradient-to-br from-emerald-600/10 via-emerald-500/5 to-lime-400/10 p-7 dark:border-zinc-800/80 dark:from-emerald-500/12 dark:via-emerald-400/6 dark:to-lime-400/10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-900/70 dark:text-emerald-200/70">
            EcoRide
          </p>
          <h2 className="mt-3 text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            20 crédits offerts à l’inscription
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
            Rejoins une communauté qui voyage plus responsable. Partage tes trajets, économise, et
            réduis ton impact.
          </p>
        </section>
      </div>
    </main>
  )
}

