import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  clearSession,
  establishSession,
  getAccessToken,
  getRefreshToken,
  getSessionUser,
  hydrateSessionFromStorage,
  refreshAccessToken,
  subscribeSession,
} from './authSession';
import {locale} from '../constants';
import {loginWithEmail} from '../services/authService';
import {getUserConfig} from '../services/userConfigService';
import {UserConfig} from '../types/config';
import {validateEmail, validatePassword} from '../utils/validation';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type AuthState = {
  status: AuthStatus;
  userEmail: string | null;
  userId: string | null;
  userName: string | null;
  accessToken: string | null;
  userConfig: UserConfig | null;
};

type AuthContextValue = {
  state: AuthState;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const UNAUTHENTICATED_STATE: AuthState = {
  status: 'unauthenticated',
  userEmail: null,
  userId: null,
  userName: null,
  accessToken: null,
  userConfig: null,
};

const AuthContext = createContext<AuthContextValue | null>(null);

function buildAuthenticatedState(
  userConfig: UserConfig,
): AuthState {
  const user = getSessionUser();
  return {
    status: 'authenticated',
    userEmail: user?.email ?? null,
    userId: user?.id ?? null,
    userName: user?.name ?? null,
    accessToken: getAccessToken(),
    userConfig,
  };
}

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [state, setState] = useState<AuthState>({
    ...UNAUTHENTICATED_STATE,
    status: 'loading',
  });

  const restoreSession = useCallback(async () => {
    setState(prev => ({...prev, status: 'loading'}));

    try {
      const stored = await hydrateSessionFromStorage();
      if (!stored) {
        setState(UNAUTHENTICATED_STATE);
        return;
      }

      await refreshAccessToken();
      const userConfig = await getUserConfig();
      setState(buildAuthenticatedState(userConfig));
    } catch {
      await clearSession();
      setState(UNAUTHENTICATED_STATE);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    return subscribeSession(() => {
      setState(prev => {
        if (!getRefreshToken()) {
          return UNAUTHENTICATED_STATE;
        }

        if (prev.status !== 'authenticated') {
          return prev;
        }

        const sessionUser = getSessionUser();
        return {
          ...prev,
          accessToken: getAccessToken(),
          userEmail: sessionUser?.email ?? prev.userEmail,
          userId: sessionUser?.id ?? prev.userId,
          userName: sessionUser?.name ?? prev.userName,
        };
      });
    });
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    if (emailError) {
      throw new Error(emailError);
    }
    if (passwordError) {
      throw new Error(passwordError);
    }

    const result = await loginWithEmail(email, password);

    await establishSession({
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      user: result.user,
    });

    let userConfig: UserConfig;
    try {
      userConfig = await getUserConfig();
    } catch {
      await clearSession();
      throw new Error(locale.login.errors.loadConfigFailed);
    }

    setState(buildAuthenticatedState(userConfig));
  }, []);

  const signOut = useCallback(async () => {
    await clearSession();
    setState(UNAUTHENTICATED_STATE);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      state,
      signIn,
      signOut,
    }),
    [state, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error(locale.errors.authProvider);
  }
  return ctx;
}

export function useIsAuthenticated(): boolean {
  return useAuth().state.status === 'authenticated';
}

export function useAuthLoading(): boolean {
  return useAuth().state.status === 'loading';
}
