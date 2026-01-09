import { LoginPage } from "@/pages/LoginPage"
import { DashboardPage } from "@/pages/DashboardPage"
import useAuthStore from "./store/useAuthStore";

function App() {
  const { isLoggedIn, logout } = useAuthStore();
  const login = useAuthStore((state) => state.login);

  const handleLogin = (userId:string) => {
    login(userId);
  }

  const handleLogout = () => {
    logout();
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />
  }

  return <DashboardPage onLogout={handleLogout} />
}

export default App
