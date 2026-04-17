export default function Footer({
  email = "contact@ecoride.fr",
  legalHref = "/mentions-legales",
}: {
  email?: string
  legalHref?: string
}) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-stone-200/70 dark:border-zinc-800/70">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-md">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              <span className="font-semibold text-emerald-800 dark:text-emerald-300">Ecoride</span> — Covoiturage en
              voiture, plus sobre.
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500 dark:text-zinc-500">
              <p>
                © {currentYear} <span className="font-semibold text-zinc-700 dark:text-zinc-200">Ecoride</span>. Tous
                droits réservés.
              </p>
              <span className="hidden h-3 w-px bg-stone-200/80 dark:bg-zinc-800/80 sm:inline-block" aria-hidden />
              <a
                href="https://www.thomas-gambin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-full outline-none transition-colors duration-300 hover:text-zinc-700 focus-visible:ring-2 focus-visible:ring-emerald-700/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:hover:text-zinc-200 dark:focus-visible:ring-offset-zinc-950"
              >
                Développé par{" "}
                <span className="font-semibold text-[#6B2F9E] transition-[filter] duration-300 group-hover:brightness-110">
                  Thomas Gambin
                </span>
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <nav aria-label="Navigation du pied de page" className="w-full sm:w-auto">
              <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
                {[
                  { href: "/", label: "Accueil" },
                  { href: "/covoiturages", label: "Covoiturages" },
                  { href: "/contact", label: "Contact" },
                  { href: "/plan-du-site", label: "Plan du site" },
                ].map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="group relative rounded-full py-1 font-semibold text-zinc-600 outline-none transition-colors duration-300 hover:text-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-700/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-zinc-400 dark:hover:text-emerald-300 dark:focus-visible:ring-offset-zinc-950"
                    >
                      <span className="relative z-10 px-1">{item.label}</span>
                      <span
                        className="pointer-events-none absolute inset-x-1 bottom-0.5 h-px origin-left scale-x-0 rounded-full bg-gradient-to-r from-emerald-500/0 via-emerald-500/80 to-emerald-600/0 opacity-0 transition-[transform,opacity] duration-300 ease-out group-hover:scale-x-100 group-hover:opacity-100 dark:from-emerald-400/0 dark:via-emerald-400/80 dark:to-emerald-500/0"
                        aria-hidden
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${email}`}
                className="rounded-full border border-stone-200/80 bg-white/60 px-4 py-2 text-sm font-semibold text-zinc-800 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-sm outline-none transition-[background-color,border-color,box-shadow] duration-300 hover:border-stone-300 hover:bg-white hover:shadow-[0_18px_50px_rgba(16,185,129,0.10)] focus-visible:ring-2 focus-visible:ring-emerald-700/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-zinc-700/80 dark:bg-zinc-900/40 dark:text-zinc-100 dark:hover:border-zinc-600 dark:hover:bg-zinc-900/60 dark:hover:shadow-[0_18px_50px_rgba(16,185,129,0.08)] dark:focus-visible:ring-offset-zinc-950"
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

            <div className="hidden h-px w-full max-w-[22rem] bg-gradient-to-r from-emerald-700/0 via-emerald-700/20 to-lime-600/0 dark:via-emerald-300/20 sm:block" aria-hidden />
          </div>
        </div>
      </div>
    </footer>
  )
}

