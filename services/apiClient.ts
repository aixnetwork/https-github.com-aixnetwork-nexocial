// Access token lives in memory only — never localStorage (XSS protection)
let accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

const BASE = import.meta.env.VITE_API_BASE_URL as string;

// Called once on app load and automatically on 401 during requests
export async function refreshSession(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) return false;
    const json = await res.json();
    if (json.success && json.data?.accessToken) {
      setAccessToken(json.data.accessToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function apiRequest<T = unknown>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string> ?? {}),
  };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

  const makeRequest = () =>
    fetch(`${BASE}${path}`, { ...init, headers, credentials: 'include' });

  let res = await makeRequest();

  // On 401 try refresh once then retry
  if (res.status === 401) {
    const refreshed = await refreshSession();
    if (refreshed) {
      headers['Authorization'] = `Bearer ${getAccessToken()}`;
      res = await makeRequest();
    } else {
      setAccessToken(null);
      throw new Error('SESSION_EXPIRED');
    }
  }

  const json = await res.json();
  if (!res.ok) {
    // If the backend returned field-level validation errors, surface them all
    if (Array.isArray(json.errors) && json.errors.length > 0) {
      const messages = json.errors
        .map((e: { message?: string }) => e.message)
        .filter(Boolean)
        .join('\n');
      throw new Error(messages);
    }
    throw new Error(json.message || `Request failed (${res.status})`);
  }
  return json as T;
}
