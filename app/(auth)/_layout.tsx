import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Index from './index';
import LoginScreen from './Login';
import WelcomeScreen from './Welcome';
// import RegisterScreen from './RegisterScreen';
// import ProfileSetupScreen from './ProfileSetupScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      

      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Index" component={Index} />
      {/* <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} /> */}
    </Stack.Navigator>
  );
}
