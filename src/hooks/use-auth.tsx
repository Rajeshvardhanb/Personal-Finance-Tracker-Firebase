
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useFirebase } from '@/firebase';
import { User, signInWithEmailAndPassword, signOut } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<{ success: boolean, error: string | null }>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticating: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { auth, isUserLoading } = useFirebase();
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (!isUserLoading && !user && pathname !== '/login') {
      router.push('/login');
    }
     if (!isUserLoading && user && pathname === '/login') {
      router.push('/');
    }
  }, [user, isUserLoading, pathname, router]);

  const login = useCallback(async (email: string, pass: string) => {
    setIsAuthenticating(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      setIsAuthenticating(false);
      return { success: true, error: null };
    } catch (error: any) {
      console.error("Firebase login error:", error);
      setIsAuthenticating(false);
      let errorMessage = "An unknown error occurred.";
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        default:
          errorMessage = 'Failed to log in. Please try again later.';
          break;
      }
      return { success: false, error: errorMessage };
    }
  }, [auth]);


  const logout = useCallback(async () => {
    await signOut(auth);
    router.push('/login');
  }, [auth, router]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading: isUserLoading, isAuthenticating }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
