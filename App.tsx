import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged, User }  from 'firebase/auth';
import { auth }   from './app/config/firebase';
import MainNavigator from './app/(tabs)/_layout';
import AuthNavigator from './app/(auth)/_layout';

export default function App() {
  const [user, setUser]         = useState<User | null>(null);
  const [initializing, setInit] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u);
      if (initializing) setInit(false);
    });
    return unsub;
  }, [initializing]);

  if (initializing) return null; 

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}