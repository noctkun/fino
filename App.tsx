import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { SpendingProvider } from './src/contexts/SpendingContext';
import { TabNavigationParamList } from './src/types';
import { THEME } from './src/constants/colors';
import GetStartedScreen from './src/screens/GetStartedScreen';
import { checkFirstLaunch, setFirstLaunchComplete } from './src/utils/firstLaunch';

// Import screens
import DashboardScreen from './src/screens/DashboardScreen';
import AddSpendScreen from './src/screens/AddSpendScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import AnalysisScreen from './src/screens/AnalysisScreen';

// Import icons
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'AddSpend') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Analysis') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: THEME.colors.primary,
        tabBarInactiveTintColor: THEME.colors.gray,
        tabBarStyle: {
          backgroundColor: THEME.colors.white,
          borderTopColor: THEME.colors.lightGray,
          borderTopWidth: 1,
          paddingBottom: Math.max(insets.bottom, 2),
          paddingTop: 4,
          height: 54 + Math.max(insets.bottom, 2),
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: THEME.fontSize.xs,
          fontWeight: '600',
          marginTop: 2,
          marginBottom: 2,
        },
        headerStyle: {
          backgroundColor: THEME.colors.white,
          borderBottomColor: THEME.colors.lightGray,
          borderBottomWidth: 1,
        },
        headerTitleStyle: {
          fontSize: THEME.fontSize.lg,
          fontWeight: 'bold',
          color: THEME.colors.black,
        },
        headerTintColor: THEME.colors.primary,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Fino Dashboard' }}
      />
      <Tab.Screen 
        name="AddSpend" 
        component={AddSpendScreen}
        options={{ title: 'Add Expense' }}
      />
      <Tab.Screen 
        name="History" 
        component={HistoryScreen}
        options={{ title: 'Spending History' }}
      />
      <Tab.Screen 
        name="Analysis" 
        component={AnalysisScreen}
        options={{ title: 'Detailed Analysis' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLaunch = async () => {
      const firstLaunch = await checkFirstLaunch();
      setIsFirstLaunch(firstLaunch);
    };
    checkLaunch();
  }, []);

  const handleGetStarted = async () => {
    await setFirstLaunchComplete();
    setIsFirstLaunch(false);
  };

  if (isFirstLaunch === null) {
    // Show loading state or splash screen
    return null;
  }

  if (isFirstLaunch) {
    return <GetStartedScreen onGetStarted={handleGetStarted} />;
  }

  return (
    <SafeAreaProvider>
      <SpendingProvider>
        <NavigationContainer>
          <StatusBar style="dark" backgroundColor={THEME.colors.background} />
          <TabNavigator />
        </NavigationContainer>
      </SpendingProvider>
    </SafeAreaProvider>
  );
}