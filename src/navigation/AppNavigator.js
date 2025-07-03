import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

import ExploreScreen from '../screens/ExploreScreen';
import WatchlistScreen from '../screens/WatchlistScreen';
import ProductScreen from '../screens/ProductScreen';
import ViewAllScreen from '../screens/ViewAllScreen';
import WatchlistDetailScreen from '../screens/WatchlistDetailScreen';
import NewsScreen from '../screens/NewsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ExploreStack = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="ExploreMain" 
        component={ExploreScreen} 
        options={{ title: 'Stocks' }}
      />
      <Stack.Screen 
        name="Product" 
        component={ProductScreen} 
        options={({ route }) => ({ 
          title: route.params?.stock?.ticker || 'Stock Details',
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen 
        name="ViewAll" 
        component={ViewAllScreen} 
        options={({ route }) => ({ 
          title: route.params?.title || 'View All',
          headerBackTitleVisible: false,
        })}
      />
    </Stack.Navigator>
  );
};

const WatchlistStack = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="WatchlistMain" 
        component={WatchlistScreen} 
        options={{ title: 'Watchlists' }}
      />
      <Stack.Screen 
        name="WatchlistDetail" 
        component={WatchlistDetailScreen} 
        options={({ route }) => ({ 
          title: route.params?.watchlist?.name || 'Watchlist',
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen 
        name="Product" 
        component={ProductScreen} 
        options={({ route }) => ({ 
          title: route.params?.stock?.ticker || 'Stock Details',
          headerBackTitleVisible: false,
        })}
      />
    </Stack.Navigator>
  );
};

const NewsStack = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="NewsMain" 
        component={NewsScreen} 
        options={{ title: 'Market News' }}
      />
      <Stack.Screen 
        name="Product" 
        component={ProductScreen} 
        options={({ route }) => ({ 
          title: route.params?.stock?.ticker || 'Stock Details',
          headerBackTitleVisible: false,
        })}
      />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Explore') {
            iconName = focused ? 'trending-up' : 'trending-up-outline';
          } else if (route.name === 'Watchlist') {
            iconName = focused ? 'bookmark' : 'bookmark-outline';
          } else if (route.name === 'News') {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBarBackground,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          height: 90,
          paddingTop: 10,
          paddingBottom: 30,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Explore" 
        component={ExploreStack}
        options={{ title: 'Stocks' }}
      />
      <Tab.Screen 
        name="Watchlist" 
        component={WatchlistStack}
        options={{ title: 'Watchlist' }}
      />
      <Tab.Screen 
        name="News" 
        component={NewsStack}
        options={{ title: 'News' }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator; 