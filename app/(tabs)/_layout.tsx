import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home  from './Home';
import Search  from './Search';
import Favorites from './Favorites';
import Details from './Details';
import Profile from './Profile';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';
          if (route.name === 'Search') iconName = 'search';
          if (route.name === 'Favorites') iconName = 'heart';
          if (route.name === 'Profile') iconName = 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home"      component={Home} />
      <Tab.Screen name="Search"    component={Search} />
      <Tab.Screen name="Favorites" component={Favorites} />
      <Tab.Screen name="Profile"   component={Profile} />
    </Tab.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PropertyDetails"
        component={Details}
        options={{ title: 'Property Details' }}
      />
    </Stack.Navigator>
  );
}