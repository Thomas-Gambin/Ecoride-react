import HomePage from "@/features/homePage/HomePage"
import { Navigate, Route, Routes } from "react-router-dom"
import RegisterPage from "./features/auth/pages/RegisterPage"
import RegisterSuccessPage from "./features/auth/pages/RegisterSuccessPage"
import ConfirmEmailPage from "./features/auth/pages/ConfirmEmailPage"
import LoginPage from "./features/auth/pages/LoginPage"
import { ProtectedRoute } from "@/shared/components/routing/ProtectedRoute"
import { RootLayout } from "@/shared/components/layout/RootLayout"
import ProfilePage from "@/features/profile/pages/ProfilePage"
import RidesListPage from "@/features/rides/pages/RidesListPage"
import RideDetailPage from "@/features/rides/pages/RideDetailPage"
import CreateCarpoolPage from "@/features/rides/pages/CreateCarpoolPage"
import MyTripsPage from "@/features/rides/pages/MyTripsPage"
import EditCarpoolPage from "@/features/rides/pages/EditCarpoolPage"

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/covoiturages" element={<RidesListPage />} />
        <Route path="/covoiturages/:id" element={<RideDetailPage />} />
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
          path="/trajets/mes-trajets"
          element={
            <ProtectedRoute roles={["ROLE_USER"]}>
              <MyTripsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trajets/creer"
          element={
            <ProtectedRoute roles={["ROLE_USER"]}>
              <CreateCarpoolPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trajets/:id/modifier"
          element={
            <ProtectedRoute roles={["ROLE_USER"]}>
              <EditCarpoolPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}

export default App
