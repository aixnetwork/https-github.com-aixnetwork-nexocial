import { apiRequest, refreshSession, setAccessToken } from './apiClient';
import type { UserProfile } from '../types';

interface AuthResponse {
  success: boolean;
  message: string;
  data: { accessToken: string; user: UserProfile };
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: { accessToken: string; user: UserProfile } | { requiresTwoFactor: true; userId: string };
}

export type LoginResult =
  | { requiresTwoFactor: true; userId: string }
  | { requiresTwoFactor: false; user: UserProfile };

interface MeResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

export async function loginUser(email: string, password: string): Promise<LoginResult> {
  const res = await apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if ('requiresTwoFactor' in res.data) {
    return { requiresTwoFactor: true, userId: res.data.userId };
  }
  setAccessToken(res.data.accessToken);
  return { requiresTwoFactor: false, user: res.data.user };
}

export async function verify2fa(userId: string, code: string): Promise<UserProfile> {
  const res = await apiRequest<AuthResponse>('/auth/verify-2fa', {
    method: 'POST',
    body: JSON.stringify({ userId, code }),
  });
  setAccessToken(res.data.accessToken);
  return res.data.user;
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
  companyName: string,
  referralCode?: string,
): Promise<UserProfile> {
  const body: Record<string, string> = { name, email, password, companyName };
  if (referralCode) body.referredBy = referralCode;

  const res = await apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  setAccessToken(res.data.accessToken);
  return res.data.user;
}

export async function forgotPassword(email: string): Promise<void> {
  await apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, password: string): Promise<void> {
  await apiRequest('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  });
}

export async function logoutUser(): Promise<void> {
  try {
    await apiRequest('/auth/logout', { method: 'POST' });
  } finally {
    setAccessToken(null);
  }
}

// Module-level singleton: the promise is created exactly once at module load time.
// React StrictMode double-invokes effects, which would cause two concurrent
// /auth/refresh calls — the second would fail because the first already rotated
// the token. By starting the promise here (outside React), both effect runs
// attach to the same in-flight request, so only one network call is made.
const _sessionRestorePromise: Promise<UserProfile | null> = (async () => {
  const refreshed = await refreshSession();
  if (!refreshed) return null;
  const res = await apiRequest<MeResponse>('/users/me');
  return res.data;
})();

export function getSessionRestorePromise(): Promise<UserProfile | null> {
  return _sessionRestorePromise;
}
