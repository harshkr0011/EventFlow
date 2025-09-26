
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signOut,
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  getAuth,
  type Auth,
  RecaptchaVerifier,
  signInWithPhoneNumber as firebaseSignInWithPhoneNumber,
  type ConfirmationResult,
} from 'firebase/auth';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { useRouter } from 'next/navigation';
import type { LoginFormData, SignupFormData } from '@/lib/types';
import { firebaseConfig } from '@/lib/firebase';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (data: LoginFormData) => Promise<void>;
  signup: (data: SignupFormData) => Promise<void>;
  logout: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithPhoneNumber: (phoneNumber: string) => Promise<ConfirmationResult>;
  sendPasswordReset: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<Auth | null>(null);
  const router = useRouter();

  useEffect(() => {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const authInstance = getAuth(app);
    setAuth(authInstance);

    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const setupRecaptcha = (authInstance: Auth) => {
    if (typeof window !== 'undefined' && (window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier.clear();
    }
    
    const recaptchaContainer = document.getElementById('recaptcha-container');
    if (!recaptchaContainer) {
      const el = document.createElement('div');
      el.id = 'recaptcha-container';
      document.body.appendChild(el);
    }
    
    (window as any).recaptchaVerifier = new RecaptchaVerifier(authInstance, 'recaptcha-container', {
      'size': 'invisible',
      'callback': (response: any) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      },
      'expired-callback': () => {
        // Response expired. Ask user to solve reCAPTCHA again.
      }
    });
  }

  const login = async (data: LoginFormData) => {
    if (!auth) return;
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: SignupFormData) => {
    if (!auth) return;
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (!auth) return;
    setLoading(true);
    try {
      await signOut(auth);
      router.push('/landing');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    if (!auth) return;
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error with Google sign-in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithPhoneNumber = async (phoneNumber: string): Promise<ConfirmationResult> => {
    if (!auth) throw new Error("Auth not initialized");
    setupRecaptcha(auth);
    const appVerifier = (window as any).recaptchaVerifier;
    return firebaseSignInWithPhoneNumber(auth, phoneNumber, appVerifier);
  };

  const sendPasswordReset = async (email: string) => {
    if (!auth) return;
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = { user, loading, login, signup, logout, signInWithGoogle, signInWithPhoneNumber, sendPasswordReset };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
