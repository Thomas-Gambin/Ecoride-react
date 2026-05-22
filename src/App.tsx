import HomePage from "@/features/homePage/HomePage"
import { Navigate, Route, Routes } from "react-router-dom"
import RegisterPage from "./features/auth/pages/RegisterPage"
import RegisterSuccessPage from "./features/auth/pages/RegisterSuccessPage"
import ConfirmEmailPage from "./features/auth/pages/ConfirmEmailPage"
import LoginPage from "./features/auth/pages/LoginPage"
import { ProtectedRoute } from "@/shared/components/routing/ProtectedRoute"
import { RootLayout } from "@/shared/components/layout/RootLayout"
import ProfilePage from "@/features/profile/pages/ProfilePage"

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register-success" element={<RegisterSuccessPage />} />
        <Route path="/confirm-email" element={<ConfirmEmailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/connexion" element={<Navigate to="/login" replace />} />
        <Route
          path="/profil"
          element={
            <ProtectedRoute roles={["ROLE_USER"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/demo-protege" element={<Navigate to="/profil" replace />} />
        <Route
          path="/trajets/creer"
          element={
            <ProtectedRoute roles={["ROLE_USER"]}>
              <main className="mx-auto w-full max-w-6xl px-6 py-14">
                <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">Créer un trajet</h1>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">Formulaire de création (à venir).</p>
              </main>
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}

export default App
