import { request, setAuthToken, setStoredUser, getStoredUser, getAuthToken } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  usuario: {
    id: string;
    NomeCompleto: string;
    Email: string;
  };
}

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await request<AuthResponse>('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    setAuthToken(response.access_token);
    setStoredUser(response.usuario);
    window.dispatchEvent(new Event('auth-change'));

    return response;
  }

  static logout(): void {
    setAuthToken(null);
    setStoredUser(null);
    window.dispatchEvent(new Event('auth-change'));
  }

  static isAuthenticated(): boolean {
    return !!getAuthToken();
  }

  static getCurrentUser(): Record<string, unknown> | null {
    return getStoredUser();
  }
}
