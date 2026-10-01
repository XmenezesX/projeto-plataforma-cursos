export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:3000';

const TOKEN_KEY = 'plataforma_token';
const USER_KEY = 'plataforma_usuario';

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function getStoredUser(): Record<string, unknown> | null {
  const data = localStorage.getItem(USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function setStoredUser(user: Record<string, unknown> | null): void {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

export async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options?.headers || {});

  // Injeta automaticamente o token JWT se disponível
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorMessage = `Falha na requisição para ${endpoint}: ${res.statusText}`;
    try {
      const errorBody = await res.json();
      if (errorBody && errorBody.message) {
        errorMessage = Array.isArray(errorBody.message)
          ? errorBody.message.join(', ')
          : errorBody.message;
      }
    } catch {
      // Ignora erro de parsing JSON
    }

    // Se receber 401 Unauthorized, limpa token inválido ou expirado e redireciona
    if (res.status === 401) {
      setAuthToken(null);
      setStoredUser(null);
      window.dispatchEvent(new Event('auth-change'));
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    throw new Error(errorMessage);
  }

  // Se status 204 No Content, não tenta fazer .json()
  if (res.status === 204) {
    return {} as T;
  }

  return res.json();
}
