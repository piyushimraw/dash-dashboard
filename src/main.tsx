import { StrictMode } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useSearchParams,
} from "react-router-dom";
import useAuthStore from "./store/useAuthStore";
import "./index.css";
import { registerSW } from "virtual:pwa-register";
import { RootLayout } from "./routes/__root";
import { AuthLayout } from "./routes/_auth";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import RentPage from "./pages/RentPage";
import ReturnPage from "./pages/ReturnPage";
import VehicleExchangePage from "./pages/VehicleExchangePage";
import AaoPage from "./pages/AaoPage";

registerSW({ immediate: true });

function getRedirectTarget(rawRedirect: string | null) {
  if (!rawRedirect) return null;
  return rawRedirect.startsWith("/") ? rawRedirect : null;
}

function LoginRoute() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [searchParams] = useSearchParams();
  const redirect = getRedirectTarget(searchParams.get("redirect"));

  if (isLoggedIn) {
    return <Navigate to={redirect || "/dashboard"} replace />;
  }

  return <LoginPage />;
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="login" element={<LoginRoute />} />
          <Route element={<AuthLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="rent" element={<RentPage />} />
            <Route path="return" element={<ReturnPage />} />
            <Route path="vehicle_exchange" element={<VehicleExchangePage />} />
            <Route path="aao" element={<AaoPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
  document.getElementById("root")
);
