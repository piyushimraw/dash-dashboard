
import useAuthStore from "@/store/useAuthStore";
import { LoginPayload, loginService } from "./loginService";

export interface AuthService {
  login(data: LoginPayload): Promise<boolean>;
}

// API-based implementation (for tests)
export const apiAuthService: AuthService = {
  async login(data: LoginPayload) {
    return await loginService(data);
  }
};

// Frontend-based implementation (for dev/prod)
export const frontendAuthService: AuthService = {
  async login(data: LoginPayload) {
    const zustandLogin = useAuthStore.getState().login;

    const success = zustandLogin(data.userId, data.password);

    if (!success) {
      throw new Error('INVALID_CREDENTIALS');
    }
    
    return true;
  }
};