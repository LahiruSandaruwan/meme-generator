import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { getOnboardingCompleted } from './src/utils/storage';
import { adManager } from './src/utils/adManager';
import { colors } from './src/constants/colors';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState<'Onboarding' | 'MainTabs'>('Onboarding');

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check if onboarding is completed
      const onboardingCompleted = await getOnboardingCompleted();
      setInitialRoute(onboardingCompleted ? 'MainTabs' : 'Onboarding');

      // Initialize AdMob
      await adManager.initialize();

      // App is ready
      setIsReady(true);
    } catch (error) {
      console.error('Error initializing app:', error);
      // Still set ready to true to show the app
      setIsReady(true);
    }
  };

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <StatusBar style="dark" />
        <AppNavigator />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
});
