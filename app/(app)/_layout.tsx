import { Stack } from "expo-router";
import { useSession } from "../../lib/context";

export default function AppLayout() {
  const { session, isLoading } = useSession();
  // Show loading while checking authentication
  if (isLoading) {
    return null; // This will show the splash screen
  }

  // If not authenticated, this layout won't render and user will be redirected
  if (!session) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false, gestureEnabled: true }}>
      <Stack.Screen />
    </Stack>
  );
}
