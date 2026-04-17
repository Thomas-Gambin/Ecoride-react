import Header from "@/shared/components/layout/Header"

function App() {
  return (
    <div className="min-h-screen bg-white font-sans text-zinc-800 antialiased transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-100">
      <Header />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-900/70 dark:text-emerald-400/80">
          Démo scroll
        </p>
        <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
          Contenu pour tester le header sticky et l’état au défilement.
        </h1>
        <div className="mt-12 space-y-6 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          {Array.from({ length: 8 }).map((_, i) => (
            <p key={i}>
              EcoRide — paragraphe de remplissage {i + 1}. Faites défiler la page pour voir le
              header passer d’un rendu plus aéré à une barre plus structurée, avec transition douce.
            </p>
          ))}
        </div>
      </main>
    </div>
  )
}

export default App
