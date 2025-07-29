import { useColorScheme } from "@/hooks/useColorScheme";
import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "styled-components/native";
import { darkTheme, lightTheme } from "./theme";

export default function App() {
  const colorScheme = useColorScheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={colorScheme === "dark" ? darkTheme : lightTheme}>
        <Slot />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
