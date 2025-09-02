'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

interface User {
  id: string;
  email: string;
  trialEndDate: Date | null;
  isSubscribed: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  isTrialActive: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from cookies or localStorage
    const checkAuth = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        // Convert string date back to Date object
        if (parsedUser.trialEndDate) {
          parsedUser.trialEndDate = new Date(parsedUser.trialEndDate);
        }
        setUser(parsedUser);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signUp = async (email: string, password: string) => {
    // In a real app, you would call your API to create a user
    // For demo purposes, we'll create a mock user with a 7-day trial
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 7); // 7 days trial

    const newUser = {
      id: Math.random().toString(36).substring(2, 9),
      email,
      trialEndDate,
      isSubscribed: false
    };

    // Save to localStorage (in a real app, you'd use secure cookies and server-side auth)
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const signIn = async (email: string, password: string) => {
    // In a real app, you would validate credentials with your API
    // For demo purposes, we'll just check if the user exists in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      // Convert string date back to Date object
      if (parsedUser.trialEndDate) {
        parsedUser.trialEndDate = new Date(parsedUser.trialEndDate);
      }
      setUser(parsedUser);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const signOut = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const isTrialActive = () => {
    if (!user || !user.trialEndDate) return false;
    return new Date() < user.trialEndDate;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, isTrialActive }}>
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