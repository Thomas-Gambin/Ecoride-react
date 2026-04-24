import Header from "@/shared/components/layout/Header"
import HomePage from "@/features/homePage/HomePage"
import { Navigate, Route, Routes } from "react-router-dom"
import RegisterPage from "./features/auth/pages/RegisterPage"
import LoginPage from "./features/auth/pages/LoginPage"

function App() {
  return (
    <div className="min-h-screen bg-white font-sans text-zinc-800 antialiased transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-100">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/connexion" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  )
}

export default App
