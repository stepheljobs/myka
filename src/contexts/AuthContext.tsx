'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { authService, AuthUser } from '@/lib/auth-service';

// Auth State Interface
interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// Auth Actions
type AuthAction =
  | { type: 'AUTH_LOADING' }
  | { type: 'AUTH_SUCCESS'; payload: AuthUser }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' };

// Initial State
const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,
};

// Auth Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_LOADING':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
        isAuthenticated: true,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

// Auth Context Interface
interface AuthContextType {
  state: AuthState;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  updateProfile: (displayName?: string, photoURL?: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  sendEmailVerification: () => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  clearError: () => void;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider Component
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state listener
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      if (user) {
        dispatch({ type: 'AUTH_SUCCESS', payload: user });
      } else {
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    });

    return unsubscribe;
  }, []);

  // Auth Methods
  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_LOADING' });
      const user = await authService.signIn(email, password);
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    } catch (error: any) {
      dispatch({ type: 'AUTH_ERROR', payload: error.message });
      throw error;
    }
  };

  const signUp = async (email: string, password: string): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_LOADING' });
      const user = await authService.signUp(email, password);
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    } catch (error: any) {
      dispatch({ type: 'AUTH_ERROR', payload: error.message });
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_LOADING' });
      await authService.signOut();
      dispatch({ type: 'AUTH_LOGOUT' });
    } catch (error: any) {
      dispatch({ type: 'AUTH_ERROR', payload: error.message });
      throw error;
    }
  };

  const sendPasswordResetEmail = async (email: string): Promise<void> => {
    try {
      await authService.sendPasswordResetEmail(email);
    } catch (error: any) {
      dispatch({ type: 'AUTH_ERROR', payload: error.message });
      throw error;
    }
  };

  const updatePassword = async (newPassword: string): Promise<void> => {
    try {
      await authService.updatePassword(newPassword);
    } catch (error: any) {
      dispatch({ type: 'AUTH_ERROR', payload: error.message });
      throw error;
    }
  };

  const updateProfile = async (displayName?: string, photoURL?: string): Promise<void> => {
    try {
      await authService.updateProfile(displayName, photoURL);
      // Refresh user data after profile update
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        dispatch({ type: 'AUTH_SUCCESS', payload: currentUser });
      }
    } catch (error: any) {
      dispatch({ type: 'AUTH_ERROR', payload: error.message });
      throw error;
    }
  };

  const deleteAccount = async (): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_LOADING' });
      await authService.deleteAccount();
      dispatch({ type: 'AUTH_LOGOUT' });
    } catch (error: any) {
      dispatch({ type: 'AUTH_ERROR', payload: error.message });
      throw error;
    }
  };

  const sendEmailVerification = async (): Promise<void> => {
    try {
      await authService.sendEmailVerification();
    } catch (error: any) {
      dispatch({ type: 'AUTH_ERROR', payload: error.message });
      throw error;
    }
  };

  const verifyEmail = async (code: string): Promise<void> => {
    try {
      await authService.verifyEmail(code);
      // Refresh user data after email verification
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        dispatch({ type: 'AUTH_SUCCESS', payload: currentUser });
      }
    } catch (error: any) {
      dispatch({ type: 'AUTH_ERROR', payload: error.message });
      throw error;
    }
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const contextValue: AuthContextType = {
    state,
    signIn,
    signUp,
    signOut,
    sendPasswordResetEmail,
    updatePassword,
    updateProfile,
    deleteAccount,
    sendEmailVerification,
    verifyEmail,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook to use Auth Context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}