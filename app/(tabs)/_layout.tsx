import { Ionicons } from "@expo/vector-icons";
import type { RouteProp } from "@react-navigation/native";
import { Tabs } from "expo-router";

const TAB_ICONS: Record<string, string> = {
  Home: "home",
  search: "search",
  Favorites: "heart",
  Profile: "person",
  explore: "compass", 
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({
        route,
      }: {
        route: RouteProp<Record<string, object | undefined>, string>;
      }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
          const iconName = TAB_ICONS[route.name] || "ellipse";
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="Home" options={{ title: "Home" }} />
      <Tabs.Screen name="search" options={{ title: "Search" }} />
      <Tabs.Screen name="Favorites" options={{}} />
      <Tabs.Screen name="Profile" options={{}} />
      <Tabs.Screen name="explore" options={{ title: "Explore" }} />
      <Tabs.Screen
        name="Details"
        options={{
          title: "Details",
          href: null,
        }}
      />
    </Tabs>
  );
}
