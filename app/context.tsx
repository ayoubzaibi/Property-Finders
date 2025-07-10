import { router } from 'expo-router';
import { signOut as firebaseSignOut, onAuthStateChanged, signInWithEmailAndPassword, User } from 'firebase/auth';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { auth } from './config/firebase';
import useStorageState from './useStorageState';

type SessionContextType = {
  user: User | null;
  loading: boolean;
  signIn?: (email: string, password: string) => Promise<void>;
  signOut?: () => void;
};

const SessionContext = createContext<SessionContextType>({ user: null, loading: true });

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) {
    throw new Error('useSession must be wrapped in a <SessionProvider />');
  }
  return value;
}

export default function SessionProvider({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [[flagLoading, signedInFlag], setSignedInFlag] = useStorageState('signedIn');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // On mount, if not signed in, sign out from Firebase (for true logout persistence)
  useEffect(() => {
    if (signedInFlag !== 'true' && user && !flagLoading ) {
      firebaseSignOut(auth);
      setUser(null);
    }
    
  }, [signedInFlag,user,flagLoading]);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSignedInFlag('true');
      setLoading(false);
      router.push('/Home');
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = () => {
    firebaseSignOut(auth);
    setSignedInFlag(null);
    setUser(null);
    router.push('/Login');
    setLoading(false);
  };

  return (
    <SessionContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </SessionContext.Provider>
  );
}