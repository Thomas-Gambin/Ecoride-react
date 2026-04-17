import Reveal from "./Reveal"
import SectionTitle from "./SectionTitle"
import SoftCard from "./SoftCard"

export default function ConceptSection({ imageSrc }: { imageSrc: string }) {
  return (
    <section id="concept" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-12">
        <Reveal>
          <SectionTitle
            eyebrow="Notre approche"
            title="Une mobilité plus sobre, sans compromis sur le confort."
            subtitle={
              <>
                <span className="font-semibold text-emerald-800 dark:text-emerald-300">Ecoride</span> valorise les trajets
                en voiture déjà prévus. Tu partages une place libre, tu divises les coûts, et tu réduis l’empreinte par
                personne.
                <br />
                Avec une expérience simple, claire, et agréable.
              </>
            }
          />

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              {
                title: "Voyager autrement",
                desc: "Un trajet utile, optimisé, pensé pour le quotidien.",
              },
              {
                title: "Réduire l’empreinte",
                desc: "Moins de voitures pour le même déplacement global.",
              },
              {
                title: "Partager les frais",
                desc: "Une contribution juste, transparente, sans friction.",
              },
            ].map((b) => (
              <SoftCard key={b.title} className="rounded-[26px]">
                <div className="p-5">
                  <p className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                    {b.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{b.desc}</p>
                </div>
              </SoftCard>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="relative">
            <div
              className="pointer-events-none absolute -inset-3 rounded-[34px] bg-gradient-to-br from-lime-500/10 via-transparent to-emerald-700/10 blur-xl dark:from-lime-400/10 dark:to-emerald-400/10"
              aria-hidden
            />
            <div className="relative overflow-hidden rounded-[32px] border border-stone-200/70 bg-white/50 shadow-[0_22px_70px_rgba(15,23,42,0.12)] dark:border-zinc-800/70 dark:bg-zinc-900/30 dark:shadow-[0_22px_70px_rgba(0,0,0,0.5)]">
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/10 via-zinc-900/0 to-zinc-900/0 dark:from-black/28" aria-hidden />
              <img
                src={imageSrc}
                alt="Covoiturage en voiture, communauté Ecoride"
                className="h-[320px] w-full object-cover sm:h-[380px] lg:h-[440px]"
                width={1200}
                height={800}
                loading="lazy"
                decoding="async"
              />
              <div className="absolute bottom-4 left-4 right-4 rounded-[24px] border border-white/35 bg-white/60 p-4 backdrop-blur-md dark:border-zinc-700/60 dark:bg-zinc-950/40">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Une expérience qui inspire confiance.
                </p>
                <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  Un design lisible, des interactions nettes, et un thème sombre/clair parfaitement cohérent.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

