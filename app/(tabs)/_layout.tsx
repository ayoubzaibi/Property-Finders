import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

const TAB_ICONS: Record<string, string> = {
  index: 'home',
  search: 'search',
  Favorites: 'heart',
  Profile: 'person',
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const iconName = TAB_ICONS[route.name] || 'ellipse';
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="Home" options={{ title: 'Home' }} />
      <Tabs.Screen name="search" options={{ title: 'Search' }} />
      <Tabs.Screen name="Favorites" options={{ title: 'Favorites' }} />
      <Tabs.Screen name="Profile" options={{ title: 'Profile' }} />
      <Tabs.Screen 
        name="Details" 
        options={{ 
          title: 'Details',
          href: null, // This hides the tab from the tab bar
        }} 
      />
    </Tabs>
  );
}