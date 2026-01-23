import { apiAuthService, frontendAuthService } from './authService';

export const authService = import.meta.env.MODE === 'test' ? apiAuthService : frontendAuthService;