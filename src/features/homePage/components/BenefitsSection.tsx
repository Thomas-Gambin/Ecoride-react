import { Leaf, ShieldCheck, Sparkles, Users } from "lucide-react"
import Reveal from "./Reveal"
import SectionTitle from "./SectionTitle"
import SoftCard from "./SoftCard"

export default function BenefitsSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
      <Reveal>
        <SectionTitle
          eyebrow="Ce que tu gagnes"
          title="Des trajets plus responsables, une recherche plus simple."
            subtitle="Tout est pensé pour aller droit au but : trouver un trajet, comprendre l’idée, et se sentir en confiance dès les premières secondes."
        />
      </Reveal>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Trajets plus responsables",
            desc: "Chaque place partagée réduit l’impact par personne.",
            icon: Leaf,
          },
          {
            title: "Recherche claire", 
            desc: "Une barre prioritaire, lisible, pensée mobile-first.",
            icon: Sparkles,
          },
          {
            title: "Expérience fluide",
            desc: "Transitions douces, micro-interactions et hiérarchie nette.",
            icon: ShieldCheck,
          },
          {
            title: "Communauté",
            desc: "Un covoiturage humain, simple à adopter au quotidien.",
            icon: Users,
          },
        ].map(({ title, desc, icon: Icon }, i) => (
          <Reveal key={title} delay={0.02 * i}>
            <SoftCard className="h-full">
              <div className="p-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-stone-200/70 bg-white/65 text-emerald-800 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-[-1px] dark:border-zinc-800/70 dark:bg-zinc-950/35 dark:text-emerald-200">
                  <Icon className="h-5 w-5" strokeWidth={1.9} aria-hidden />
                </div>
                <p className="mt-4 text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{desc}</p>
              </div>
            </SoftCard>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

