import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useSession } from "../../../lib/context";

export default function HomeScreen() {
  const { session } = useSession();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Welcome back!</Text>
        <HelloWave />
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.subtitleText}>Protected Dashboard</Text>
        <Text>
          Hello, <Text style={styles.boldText}>{session?.nombre}</Text>!
          You&apos;re now in the protected area of the app.
        </Text>
      </View>

      <View style={styles.stepContainer}>
        <Text style={styles.subtitleText}>Navigation</Text>
        <Text>Use the tabs below to navigate between different sections:</Text>
        <Text>
          • <Text style={styles.boldText}>Home</Text> - Your dashboard
        </Text>
        <Text>
          • <Text style={styles.boldText}>Explore</Text> - Discover content
        </Text>
        <Text>
          • <Text style={styles.boldText}>Profile</Text> - Manage your account
        </Text>
      </View>

      <View style={styles.stepContainer}>
        <Text style={styles.subtitleText}>Protected Features</Text>
        <Text>
          This entire section is protected and only accessible to authenticated
          users. If you sign out, you&apos;ll be redirected to the public home
          page.
        </Text>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitleText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  boldText: {
    fontWeight: "600",
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
