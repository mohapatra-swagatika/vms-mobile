import React, {createContext, useContext, useMemo, useState} from 'react';

import {strings} from '../constants';
import {loginWithEmail} from '../services/authService';
import {validateEmail, validatePassword} from '../utils/validation';

type AuthState = {
  isAuthenticated: boolean;
  userEmail: string | null;
  userId: string | null;
  userName: string | null;
  accessToken: string | null;
};

type AuthContextValue = {
  state: AuthState;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    userEmail: null,
    userId: null,
    userName: null,
    accessToken: null,
  });

  const value = useMemo<AuthContextValue>(() => {
    return {
      state,
      signIn: async (email: string, password: string) => {
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);
        if (emailError) {
          throw new Error(emailError);
        }
        if (passwordError) {
          throw new Error(passwordError);
        }

        try {
          const result = await loginWithEmail(email, password);
          setState({
            isAuthenticated: true,
            userEmail: result.user.email,
            userId: result.user.id,
            userName: result.user.name,
            accessToken: result.access_token,
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : strings.auth.loginFailed;
          throw new Error(message);
        }
      },
      signOut: () => {
        setState({
          isAuthenticated: false,
          userEmail: null,
          userId: null,
          userName: null,
          accessToken: null,
        });
      },
    };
  }, [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
