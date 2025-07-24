import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./Login";
import Register from "./Register";
import WelcomeScreen from "./Welcome";

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}
