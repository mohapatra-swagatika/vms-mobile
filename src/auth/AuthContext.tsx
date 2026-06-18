import React, {createContext, useContext, useMemo, useState} from 'react';

import {strings} from '../constants';
import {loginWithEmail} from '../services/authService';
import {UserAssignment} from '../types/auth';
import {
  canCheckInVisitor,
  canCheckOutVisitor,
  canCreateVisitor,
  canReadVisitors,
  canViewVisitorList,
  hasVisitorPortalAccess,
} from '../utils/permissions';
import {validateEmail, validatePassword} from '../utils/validation';

type AuthState = {
  isAuthenticated: boolean;
  userEmail: string | null;
  userId: string | null;
  userName: string | null;
  accessToken: string | null;
  permissions: string[];
  assignments: UserAssignment[];
};

type AuthContextValue = {
  state: AuthState;
  canCreateVisitor: boolean;
  canReadVisitors: boolean;
  canViewVisitorList: boolean;
  canCheckInVisitor: boolean;
  canCheckOutVisitor: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const emptyState: AuthState = {
  isAuthenticated: false,
  userEmail: null,
  userId: null,
  userName: null,
  accessToken: null,
  permissions: [],
  assignments: [],
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [state, setState] = useState<AuthState>(emptyState);

  const value = useMemo<AuthContextValue>(() => {
    return {
      state,
      canCreateVisitor: canCreateVisitor(state.permissions),
      canReadVisitors: canReadVisitors(state.permissions),
      canViewVisitorList: canViewVisitorList(state.permissions),
      canCheckInVisitor: canCheckInVisitor(state.permissions),
      canCheckOutVisitor: canCheckOutVisitor(state.permissions),
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
          const permissions = result.permissions ?? [];

          if (!hasVisitorPortalAccess(permissions)) {
            throw new Error(strings.auth.noVisitorAccess);
          }

          setState({
            isAuthenticated: true,
            userEmail: result.user.email,
            userId: result.user.id,
            userName: result.user.name,
            accessToken: result.access_token,
            permissions,
            assignments: result.assignments ?? [],
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : strings.auth.loginFailed;
          throw new Error(message);
        }
      },
      signOut: () => {
        setState(emptyState);
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
