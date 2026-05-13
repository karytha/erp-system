import { apiFetch, setStoredToken } from "@/lib/api-client";

export type AuthUser = { id: string; email: string; name: string };

export type LoginResponse = { token: string; user: AuthUser };

export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
  const data = await apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    skipAuth: true,
  });
  setStoredToken(data.token);
  return data;
}

export async function registerRequest(
  email: string,
  password: string,
  name: string,
): Promise<LoginResponse> {
  const data = await apiFetch<LoginResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
    skipAuth: true,
  });
  setStoredToken(data.token);
  return data;
}

export function logout() {
  setStoredToken(null);
}
