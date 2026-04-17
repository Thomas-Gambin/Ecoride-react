export default function SiteFooter({
  email = "contact@ecoride.fr",
  legalHref = "/mentions-legales",
}: {
  email?: string
  legalHref?: string
}) {
  return (
    <footer className="border-t border-stone-200/70 dark:border-zinc-800/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          <span className="font-semibold text-emerald-800 dark:text-emerald-300">Ecoride</span> — Covoiturage en voiture,
          plus sobre.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${email}`}
            className="rounded-full border border-stone-200/80 bg-white/60 px-4 py-2 text-sm font-semibold text-zinc-800 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-sm outline-none transition-[background-color,border-color] duration-300 hover:border-stone-300 hover:bg-white focus-visible:ring-2 focus-visible:ring-emerald-700/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-zinc-700/80 dark:bg-zinc-900/40 dark:text-zinc-100 dark:hover:border-zinc-600 dark:hover:bg-zinc-900/60 dark:focus-visible:ring-offset-zinc-950"
          >
            {email}
          </a>
          <a
            href={legalHref}
            className="text-sm font-semibold text-zinc-600 outline-none transition-colors duration-300 hover:text-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-700/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-zinc-400 dark:hover:text-emerald-300 dark:focus-visible:ring-offset-zinc-950"
          >
            Mentions légales
          </a>
        </div>
      </div>
    </footer>
  )
}

