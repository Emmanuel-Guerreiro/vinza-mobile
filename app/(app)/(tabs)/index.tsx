import { Image } from "expo-image";
import { StyleSheet } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useSession } from "../../../ctx";

export default function HomeScreen() {
  const { session } = useSession();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome back!</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.userInfo}>
        <ThemedText type="subtitle">Protected Dashboard</ThemedText>
        <ThemedText>
          Hello,{" "}
          <ThemedText type="defaultSemiBold">{session?.user?.name}</ThemedText>!
          You&apos;re now in the protected area of the app.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Navigation</ThemedText>
        <ThemedText>
          Use the tabs below to navigate between different sections:
        </ThemedText>
        <ThemedText>
          • <ThemedText type="defaultSemiBold">Home</ThemedText> - Your
          dashboard
        </ThemedText>
        <ThemedText>
          • <ThemedText type="defaultSemiBold">Explore</ThemedText> - Discover
          content
        </ThemedText>
        <ThemedText>
          • <ThemedText type="defaultSemiBold">Profile</ThemedText> - Manage
          your account
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Protected Features</ThemedText>
        <ThemedText>
          This entire section is protected and only accessible to authenticated
          users. If you sign out, you&apos;ll be redirected to the public home
          page.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  userInfo: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
