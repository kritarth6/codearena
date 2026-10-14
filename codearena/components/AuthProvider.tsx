'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { UserProfile } from '../types';
import { auth, isFirebaseConfigured } from '../lib/firebase';
import { fetchUserProfile, logoutUser } from '../lib/auth';
import { dataService } from '../lib/services';

interface AuthContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  logout: () => Promise<void>;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: async () => {},
  loading: true,
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    if (user?.uid) {
      const updated = await fetchUserProfile(user.uid);
      if (updated) {
        setUserState(updated);
        dataService.setCurrentUser(updated);
      }
    }
  };

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (isFirebaseConfigured() && auth) {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          try {
            const profile = await fetchUserProfile(firebaseUser.uid);
            if (profile) {
              if (profile.status === 'blocked') {
                await logoutUser();
                setUserState(null);
              } else {
                setUserState(profile);
                dataService.setCurrentUser(profile);
              }
            } else {
              setUserState(null);
            }
          } catch (err) {
            console.error('Error fetching user profile in auth state change:', err);
            setUserState(null);
          }
        } else {
          setUserState(null);
          dataService.setCurrentUser(null);
        }
        setLoading(false);
      });
    } else {
      // Local dev fallback when Firebase is not configured
      dataService.getCurrentUser().then((current) => {
        setUserState(current);
        setLoading(false);
      });
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const setUser = (u: UserProfile | null) => {
    setUserState(u);
    dataService.setCurrentUser(u);
  };

  const logout = async () => {
    await logoutUser();
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
