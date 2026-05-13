import { labels } from "@/constants";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export const AUTH_TOKEN_KEY = "erp_token";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  else window.localStorage.removeItem(AUTH_TOKEN_KEY);
}

type ApiOptions = RequestInit & { token?: string | null; skipAuth?: boolean };

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { token, skipAuth, ...init } = options;
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }
  const authToken = skipAuth ? null : (token ?? getStoredToken());
  if (authToken) {
    headers.set("Authorization", `Bearer ${authToken}`);
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const looksLikeNetwork =
      err instanceof TypeError ||
      /failed to fetch|networkerror|network request failed|load failed/i.test(msg);
    if (looksLikeNetwork) {
      throw new Error(labels.apiErrors.networkFailure(API_BASE));
    }
    throw err;
  }

  if (res.status === 204) {
    return undefined as T;
  }
  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(labels.apiErrors.invalidJsonResponse(API_BASE, res.status));
    }
  }
  if (!res.ok) {
    const msg =
      data && typeof data === "object" && data !== null && "message" in data
        ? String((data as { message: unknown }).message)
        : labels.apiErrors.httpStatus(res.status);
    throw new Error(msg);
  }
  return data as T;
}
