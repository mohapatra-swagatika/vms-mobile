import {locale} from '../constants';
import {mmkv} from '../storage/mmkv';
import {StoredSession} from './types';

export async function loadStoredSession(): Promise<StoredSession | null> {
  try {
    const raw = mmkv.getString(locale.storageKeys.authSession);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as StoredSession;
    if (!parsed?.refreshToken || !parsed?.user?.id) {
      return null;
    }

    return {
      ...parsed,
      permissions: parsed.permissions ?? [],
    };
  } catch {
    return null;
  }
}

export async function saveStoredSession(session: StoredSession): Promise<void> {
  mmkv.set(locale.storageKeys.authSession, JSON.stringify(session));
}

export async function clearStoredSession(): Promise<void> {
  mmkv.remove(locale.storageKeys.authSession);
}
