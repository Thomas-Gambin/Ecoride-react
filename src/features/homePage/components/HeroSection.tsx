import type { ComponentType } from "react"
import { Leaf, ShieldCheck, Users } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import Reveal from "./Reveal"
import TripSearchBar from "./TripSearchBar"

export default function HeroSection({
  imageSrc,
  onSearchSubmit,
}: {
  imageSrc: string
  onSearchSubmit?: () => void
}) {
  const highlights: Array<{
    icon: ComponentType<{ className?: string; strokeWidth?: number; "aria-hidden"?: boolean }>
    label: string
  }> = [
    { icon: Leaf, label: "Impact réduit" },
    { icon: Users, label: "Esprit communauté" },
    { icon: ShieldCheck, label: "Expérience rassurante" },
  ]

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-10 sm:px-6 sm:pb-14 lg:px-8 lg:pb-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
          <div>
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-stone-200/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-700 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-sm dark:border-zinc-800/70 dark:bg-zinc-900/40 dark:text-zinc-200">
                <span className="h-2 w-2 rounded-full bg-emerald-600/80 dark:bg-emerald-400/80" aria-hidden />
                Covoiturage voiture, responsable et écologique
              </p>
            </Reveal>

            <Reveal delay={0.05}>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl lg:text-[3.35rem] lg:leading-[1.02] dark:text-zinc-50">
                Voyagez mieux,
                <span className="block bg-gradient-to-r from-emerald-800 via-emerald-700 to-lime-700 bg-clip-text text-transparent dark:from-emerald-300 dark:via-emerald-200 dark:to-lime-200">
                  ensemble.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg dark:text-zinc-400">
                <span className="font-semibold text-emerald-800 dark:text-emerald-300">Ecoride</span> simplifie le
                covoiturage en voiture avec une expérience premium : trouvez un trajet en quelques secondes, partagez
                les frais, et réduisez l’impact de chaque déplacement.
              </p>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#recherche"
                  className={cn(
                    "inline-flex items-center justify-center rounded-full bg-emerald-800 px-6 py-3 text-base font-semibold text-white",
                    "shadow-[0_1px_0_rgba(255,255,255,0.12)_inset] outline-none ring-emerald-900/10",
                    "transition-[transform,box-shadow,background-color] duration-300",
                    "hover:bg-emerald-900 hover:shadow-[0_1px_0_rgba(255,255,255,0.14)_inset,0_18px_50px_rgba(16,185,129,0.22)]",
                    "focus-visible:ring-2 focus-visible:ring-emerald-700/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                    "active:scale-[0.98]",
                    "dark:bg-emerald-700 dark:hover:bg-emerald-600 dark:focus-visible:ring-offset-zinc-950"
                  )}
                >
                  Trouver un trajet
                </a>
                <a
                  href="#concept"
                  className={cn(
                    "inline-flex items-center justify-center rounded-full border border-stone-200/80 bg-white/70 px-6 py-3 text-base font-semibold text-zinc-800",
                    "shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-sm outline-none",
                    "transition-[transform,background-color,border-color] duration-300",
                    "hover:border-stone-300 hover:bg-white hover:shadow-[0_18px_50px_rgba(16,185,129,0.14)]",
                    "focus-visible:ring-2 focus-visible:ring-emerald-700/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                    "active:scale-[0.99]",
                    "dark:border-zinc-700/90 dark:bg-zinc-900/50 dark:text-zinc-100 dark:hover:border-zinc-600 dark:hover:bg-zinc-900/70 dark:focus-visible:ring-offset-zinc-950"
                  )}
                >
                  Découvrir
                  <span className="ml-1 inline-block text-emerald-800 dark:text-emerald-300">Ecoride</span>
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-10 flex flex-wrap gap-2.5 text-sm text-zinc-600 dark:text-zinc-400">
                {highlights.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full border border-stone-200/70 bg-white/60 px-4 py-2 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-sm dark:border-zinc-800/70 dark:bg-zinc-900/35"
                  >
                    <Icon className="h-4 w-4 text-emerald-700/75 dark:text-emerald-300/85" strokeWidth={1.9} aria-hidden />
                    <span className="font-medium">{label}</span>
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.08} className="lg:justify-self-end">
            <div className="relative">
              <div
                className="pointer-events-none absolute -inset-3 rounded-[34px] bg-gradient-to-br from-emerald-700/14 via-transparent to-lime-500/14 blur-xl dark:from-emerald-400/12 dark:to-lime-400/12"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-[32px] border border-stone-200/70 bg-white/50 shadow-[0_22px_70px_rgba(15,23,42,0.14)] backdrop-blur-sm dark:border-zinc-800/70 dark:bg-zinc-900/30 dark:shadow-[0_22px_70px_rgba(0,0,0,0.55)]">
                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900/0 via-zinc-900/0 to-zinc-900/10 dark:to-black/25" aria-hidden />
                <img
                  src={imageSrc}
                  alt="Covoiturage en voiture, Ecoride"
                  className="h-[320px] w-full object-cover sm:h-[380px] lg:h-[460px]"
                  width={1200}
                  height={800}
                  decoding="async"
                />
                
              </div>
            </div>
          </Reveal>
        </div>

        <div id="recherche" className="mt-10 scroll-mt-28 sm:mt-12">
          <Reveal delay={0.1}>
            <TripSearchBar
              onSubmit={() => {
                onSearchSubmit?.()
              }}
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

