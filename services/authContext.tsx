import { onAuthStateChanged, User } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../app/config/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  loading: true,
  setUser: () => {
    console.warn('AuthProvider not available');
  }
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === defaultAuthContext) {
    console.warn('useAuth called outside of AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const setUser = (newUser: User | null) => {
    console.log('AuthProvider: setUser called with:', newUser ? newUser.email : 'null');
    setUserState(newUser);
    setLoading(false);
  };

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener...');
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('AuthProvider: Auth state changed:', currentUser ? currentUser.email : 'No user');
      setUserState(currentUser);
      setLoading(false);
    });

    const currentUser = auth.currentUser;
    if (currentUser) {
      console.log('AuthProvider: Setting user from currentUser immediately:', currentUser.email);
      setUserState(currentUser);
      setLoading(false);
    }

    return unsubscribe;
  }, []);

  const value = {
    user,
    loading,
    setUser
  };

  console.log('AuthProvider: Rendering with user:', user ? user.email : 'No user', 'loading:', loading);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 