import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { SessionProvider, useSession } from "../ctx";
import { SplashScreenController } from "../splash";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SessionProvider>
        <SplashScreenController />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <RootNavigator />
        </TouchableWithoutFeedback>
      </SessionProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

// Separate component to access SessionProvider context
function RootNavigator() {
  const { session, isLoading } = useSession();

  // Show loading while checking authentication
  if (isLoading) {
    return null; // This will show the splash screen
  }

  return (
    <Stack>
      {/* Unprotected routes - accessible to everyone */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />

      {/* Protected routes - only accessible when authenticated */}
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
