import React, { createContext, useEffect, useState } from 'react';
import authService, { AuthResponse } from '../services/auth.service';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';

// Define the user type
export interface User {
  id: number | string;
  username: string;
  email: string;
  roles: string[];
}

// Define the context value type
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  register: (username: string, email: string, password: string, fullName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Ensure loading is true initially
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Setup axios interceptors for JWT
        authService.setupAxiosInterceptors?.();

        // 1. Check if user is logged in via backend (token-based)
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
        }

        // 2. Listen for Firebase login state changes
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            await firebaseUser.getIdToken();

            setUser({
              id: firebaseUser.uid,
              username: firebaseUser.displayName || firebaseUser.email || '',
              email: firebaseUser.email || '',
              roles: [], // Optionally fetch roles from your backend
            });
            setIsAuthenticated(true);
          } else {
            // Reset state if no backend or Firebase user is logged in
            if (!currentUser) {
              setUser(null);
              setIsAuthenticated(false);
            }
          }
          setLoading(false); // Authentication state is resolved
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error initializing authentication:', error);
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    user,
    loading,
    error,
    login: async (username, password) => {
      setLoading(true);
      setError(null);
      try {
        const data = await authService.login({ username, password });
        setUser({
          id: data.id,
          username: data.username,
          email: data.email,
          roles: data.roles,
        });
        setIsAuthenticated(true);
        return data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to login');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    logout: () => {
      authService.logout();
      auth.signOut(); // Firebase logout too
      setUser(null);
      setIsAuthenticated(false);
    },
    register: async (username, email, password, fullName) => {
      setLoading(true);
      setError(null);
      try {
        await authService.register({ username, email, password, fullName });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to register');
        throw err;
      } finally {
        setLoading(false);
      }
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex h-screen w-full items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-700">Loading...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export { useAuth } from '../hooks/useAuth';

