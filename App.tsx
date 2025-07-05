import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged, User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import AuthNavigator from './app/(auth)/_layout';
import MainNavigator from './app/(tabs)/_layout';
import { auth } from './app/config/firebase';
import { store } from './store';

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
    <Provider store={store}>
      <NavigationContainer>
        {user ? <MainNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </Provider>
  );
}