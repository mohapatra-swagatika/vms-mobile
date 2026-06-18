import {clearStoredSession, loadStoredSession, saveStoredSession} from './tokenStorage';
import {StoredSession, StoredUser} from './types';
import {locale} from '../constants';
import {refreshAccessTokenWithApi} from '../services/authService';

type SessionListener = () => void;

let accessToken: string | null = null;
let refreshToken: string | null = null;
let user: StoredUser | null = null;
let refreshPromise: Promise<string> | null = null;
const listeners = new Set<SessionListener>();

function notify() {
  listeners.forEach(listener => listener());
}

export function subscribeSession(listener: SessionListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function getRefreshToken(): string | null {
  return refreshToken;
}

export function getSessionUser(): StoredUser | null {
  return user;
}

export function hasPersistedSession(): boolean {
  return Boolean(refreshToken);
}

export async function hydrateSessionFromStorage(): Promise<StoredSession | null> {
  const stored = await loadStoredSession();
  if (!stored) {
    return null;
  }

  refreshToken = stored.refreshToken;
  user = stored.user;
  return stored;
}

export async function establishSession(input: {
  accessToken: string;
  refreshToken: string;
  user: StoredUser;
}): Promise<void> {
  accessToken = input.accessToken;
  refreshToken = input.refreshToken;
  user = input.user;

  await saveStoredSession({
    refreshToken: input.refreshToken,
    user: input.user,
  });
  notify();
}

export async function updateAccessToken(nextAccessToken: string): Promise<void> {
  accessToken = nextAccessToken;
  notify();
}

export async function rotateSessionTokens(input: {
  accessToken: string;
  refreshToken?: string;
  user?: StoredUser;
}): Promise<void> {
  accessToken = input.accessToken;
  if (input.refreshToken) {
    refreshToken = input.refreshToken;
  }
  if (input.user) {
    user = input.user;
  }

  if (refreshToken && user) {
    await saveStoredSession({refreshToken, user});
  }
  notify();
}

export async function clearSession(): Promise<void> {
  accessToken = null;
  refreshToken = null;
  user = null;
  refreshPromise = null;
  await clearStoredSession();
  notify();
}

/**
 * Calls POST /auth/refresh → receives new access_token → stores and returns it.
 * Concurrent callers share one in-flight refresh request.
 */
export async function refreshAccessToken(): Promise<string> {
  if (accessToken && !isTokenExpired(accessToken)) {
    return accessToken;
  }

  if (!refreshToken) {
    throw new Error(locale.errors.noRefreshToken);
  }

  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const result = await refreshAccessTokenWithApi(refreshToken!);
    await rotateSessionTokens({
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      user: result.user,
    });
    return result.access_token;
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

function decodeJwtPayload(token: string): {exp?: number} | null {
  try {
    const segment = token.split('.')[1];
    if (!segment) {
      return null;
    }

    const normalized = segment.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const decoded = (globalThis as {atob?: (value: string) => string}).atob?.(padded);
    if (!decoded) {
      return null;
    }

    return JSON.parse(decoded) as {exp?: number};
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) {
    return false;
  }

  const expiresAtMs = payload.exp * 1000;
  const bufferMs = 60_000;
  return Date.now() >= expiresAtMs - bufferMs;
}
