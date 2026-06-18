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
import {apiPaths} from '../constants/apiPaths';
import {locale} from '../constants';
import {loginWithEmail} from '../services/authService';
import {apiRequest} from '../services/apiClient';
import {getUserConfig} from '../services/userConfigService';
import {UserConfig} from '../types/config';
import {
  canCheckInVisitor,
  canCheckOutVisitor,
  canCreateVisitor,
  canReadVisitors,
  canViewVisitorList,
  hasVisitorPortalAccess,
} from '../utils/permissions';
import {validateEmail, validatePassword} from '../utils/validation';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type AuthState = {
  status: AuthStatus;
  userEmail: string | null;
  userId: string | null;
  userName: string | null;
  accessToken: string | null;
  userConfig: UserConfig | null;
  permissions: string[];
};

type AuthContextValue = {
  state: AuthState;
  canCreateVisitor: boolean;
  canReadVisitors: boolean;
  canViewVisitorList: boolean;
  canCheckInVisitor: boolean;
  canCheckOutVisitor: boolean;
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
  permissions: [],
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchPermissions(): Promise<string[]> {
  const data = await apiRequest<{permissions?: string[]}>(
    apiPaths.auth.permissions,
    {method: 'GET'},
  );
  return data.permissions ?? [];
}

function buildAuthenticatedState(
  userConfig: UserConfig,
  permissions: string[],
): AuthState {
  const user = getSessionUser();
  return {
    status: 'authenticated',
    userEmail: user?.email ?? null,
    userId: user?.id ?? null,
    userName: user?.name ?? null,
    accessToken: getAccessToken(),
    userConfig,
    permissions,
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
      const [userConfig, permissions] = await Promise.all([
        getUserConfig(),
        fetchPermissions(),
      ]);
      setState(buildAuthenticatedState(userConfig, permissions));
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
    let permissions: string[];
    try {
      [userConfig, permissions] = await Promise.all([
        getUserConfig(),
        fetchPermissions(),
      ]);
    } catch {
      await clearSession();
      throw new Error(locale.login.errors.loadConfigFailed);
    }

    if (!hasVisitorPortalAccess(permissions)) {
      await clearSession();
      throw new Error(locale.login.errors.noVisitorAccess);
    }

    setState(buildAuthenticatedState(userConfig, permissions));
  }, []);

  const signOut = useCallback(async () => {
    await clearSession();
    setState(UNAUTHENTICATED_STATE);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      state,
      canCreateVisitor: canCreateVisitor(state.permissions),
      canReadVisitors: canReadVisitors(state.permissions),
      canViewVisitorList: canViewVisitorList(state.permissions),
      canCheckInVisitor: canCheckInVisitor(state.permissions),
      canCheckOutVisitor: canCheckOutVisitor(state.permissions),
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
