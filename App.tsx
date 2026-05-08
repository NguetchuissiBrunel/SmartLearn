import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { initDatabase } from './src/db/database';
import { LLMService } from './src/services/llm';
import { SyncService } from './src/services/syncService';
import RegistrationScreen from './src/screens/RegistrationScreen';
import ChaptersScreen from './src/screens/ChaptersScreen';
import ExerciseScreen from './src/screens/ExerciseScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SplashScreen from './src/screens/SplashScreen';
import { Colors } from './src/constants/theme';
import { User } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

const Stack = createStackNavigator();

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const setup = async () => {
      try {
        await initDatabase();
        // Initialize LLM in background
        LLMService.init();
        // Check for sync
        SyncService.startSync();
        setIsReady(true);
      } catch (err) {
        console.error('Failed to init DB', err);
        // Still show screen but UI might be limited
        setIsReady(true);
      }
    };
    setup();
  }, []);

  if (!isReady) {
    return null; // Or a splash screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: 'transparent' },
          gestureEnabled: true,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen 
          name="Chapters" 
          component={ChaptersScreen} 
          options={({ navigation }) => ({
            headerShown: true,
            title: 'Mes Chapitres',
            headerStyle: {
              backgroundColor: Colors.bgGradientStart,
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: Colors.primary,
            headerTitleStyle: {
              fontWeight: '900',
              fontSize: 22,
            },
            headerRight: () => (
              <TouchableOpacity 
                onPress={() => navigation.navigate('Profile')}
                style={{ marginRight: 20 }}
              >
                <User color={Colors.primary} size={24} />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen 
          name="Exercise" 
          component={ExerciseScreen} 
          options={{ 
            headerShown: true,
            title: 'Leçon IA',
            headerStyle: {
              backgroundColor: Colors.bgGradientStart,
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: Colors.primary,
          }}
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ 
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
