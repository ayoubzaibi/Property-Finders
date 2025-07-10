import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import SessionProvider, { useSession } from './context';
import SplashScreenController from './splash';

function RootNavigator() {
  const { user, loading } = useSession();

  if (loading) return null;

  return (
    <Stack screenOptions={{headerShown: false}}>
      {user ? (
        <Stack.Screen name="(tabs)"  />
      ) : (
        <Stack.Screen name="(auth)"  />
      )}
      <Stack.Screen name="+not-found"  />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) return null;

  return (
    <SessionProvider>
      <SplashScreenController />
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <RootNavigator />
        <StatusBar style="auto" />
      </ThemeProvider>
    </SessionProvider>
  );
}

