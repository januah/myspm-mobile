import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { initializeI18n } from "@/i18n";
import CalendarService from "@/services/CalendarService";
import NotificationService from "@/services/NotificationService";
import TeacherService from "@/services/teacherService";
import store, { RootState, AppDispatch } from "@/store";
import { loadLanguagePreference, selectCurrentLanguage } from "@/store/languageSlice";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="practice-session" options={{ headerShown: false }} />
      <Stack.Screen name="scan-result" options={{ headerShown: false }} />
      <Stack.Screen name="exam-mode" options={{ headerShown: false }} />
    </Stack>
  );
}

function useOnboardingCheck() {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("onboarding_complete")
      .then((value) => {
        if (value !== "true") {
          router.replace("/onboarding");
        }
      })
      .catch(() => {})
      .finally(() => setChecked(true));
  }, []);

  return checked;
}

function RootLayoutContent() {
  const dispatch = useDispatch();
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const onboardingChecked = useOnboardingCheck();

  useEffect(() => {
    // Initialize i18n
    initializeI18n().then(() => {
      // Load language preference from storage
      dispatch(loadLanguagePreference() as any);
    });
  }, [dispatch]);

  useEffect(() => {
    if ((fontsLoaded || fontError) && onboardingChecked) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, onboardingChecked]);

  // Update all services with current language
  const currentLanguage = useSelector(selectCurrentLanguage);
  useEffect(() => {
    if (currentLanguage) {
      CalendarService.setLanguage(currentLanguage);
      NotificationService.setLanguage(currentLanguage);
      TeacherService.setLanguage(currentLanguage);
    }
  }, [currentLanguage]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView>
            <KeyboardProvider>
              <RootLayoutNav />
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutContent />
    </Provider>
  );
}
