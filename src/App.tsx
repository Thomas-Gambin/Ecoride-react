import Header from "@/shared/components/layout/Header"
import HomePage from "@/features/homePage/HomePage"

function App() {
  return (
    <div className="min-h-screen bg-white font-sans text-zinc-800 antialiased transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-100">
      <Header />
      <HomePage />
    </div>
  )
}

export default App
