export const API_BASE_URL = 'http://localhost:3001';

export async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
  if (!res.ok) {
    throw new Error(`Falha na requisição para ${endpoint}: ${res.statusText}`);
  }
  return res.json();
}
