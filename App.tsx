import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';

import AuthNavigator from './app/(auth)/_layout';
import MainNavigator from './app/(tabs)/_layout';
import { AuthProvider, useAuth } from './services/authContext';
import { store } from './store';

function AppContent() {
  const { user, loading } = useAuth();

  console.log('App render - user:', user ? user.email : 'No user', 'loading:', loading);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#667eea' }}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ color: '#fff', marginTop: 10, fontSize: 16 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}