import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AppProvider, useApp } from './src/contexts/AppContext';
import { ExpenseProvider } from './src/contexts/ExpenseContext';
import ExpensesScreen from './src/screens/ExpensesScreen';
import SummaryScreen from './src/screens/SummaryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import SetupScreen from './src/screens/SetupScreen';

const Tab = createBottomTabNavigator();

function MainApp() {
  const { user, groupId, loading, isFirebaseConnected } = useApp();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
        <ActivityIndicator size="large" color="#6C5CE7" />
      </View>
    );
  }

  if (!user || !groupId) {
    return <SetupScreen />;
  }

  return (
    <ExpenseProvider groupId={groupId} isFirebaseConnected={isFirebaseConnected}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Expenses') {
                iconName = focused ? 'receipt' : 'receipt-outline';
              } else if (route.name === 'Summary') {
                iconName = focused ? 'pie-chart' : 'pie-chart-outline';
              } else if (route.name === 'Settings') {
                iconName = focused ? 'settings' : 'settings-outline';
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#6C5CE7',
            tabBarInactiveTintColor: '#999',
            tabBarStyle: {
              borderTopWidth: 0,
              elevation: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              height: 60,
              paddingBottom: 8,
              paddingTop: 4,
            },
            headerStyle: {
              backgroundColor: '#6C5CE7',
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: '700',
            },
          })}
        >
          <Tab.Screen name="Expenses" component={ExpensesScreen} />
          <Tab.Screen name="Summary" component={SummaryScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style="light" />
    </ExpenseProvider>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
