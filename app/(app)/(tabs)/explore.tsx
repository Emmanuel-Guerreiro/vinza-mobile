import { Image } from "expo-image";
import { Platform, StyleSheet, Text, View } from "react-native";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useSession } from "../../../lib/context";

export default function TabTwoScreen() {
  const { session } = useSession();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Explore</Text>
      </View>

      <View style={styles.protectedNotice}>
        <Text style={styles.subtitleText}>Protected Content</Text>
        <Text>
          Welcome, <Text style={styles.boldText}>{session?.nombre}</Text>! This
          explore section contains protected content only available to
          authenticated users.
        </Text>
      </View>

      <Text>This app includes example code to help you get started.</Text>

      <Collapsible title="Protected Features">
        <Text>As an authenticated user, you have access to:</Text>
        <Text>
          • <Text style={styles.boldText}>Dashboard</Text> - Your personalized
          home
        </Text>
        <Text>
          • <Text style={styles.boldText}>Profile Management</Text> - Update
          your account
        </Text>
        <Text>
          • <Text style={styles.boldText}>Secure Navigation</Text> - Protected
          routes
        </Text>
      </Collapsible>

      <Collapsible title="File-based routing">
        <Text>
          This app has two screens:{" "}
          <Text style={styles.boldText}>app/(tabs)/index.tsx</Text> and{" "}
          <Text style={styles.boldText}>app/(tabs)/explore.tsx</Text>
        </Text>
        <Text>
          The layout file in{" "}
          <Text style={styles.boldText}>app/(tabs)/_layout.tsx</Text> sets up
          the tab navigator.
        </Text>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <Text style={styles.linkText}>Learn more</Text>
        </ExternalLink>
      </Collapsible>

      <Collapsible title="Android, iOS, and web support">
        <Text>
          You can open this project on Android, iOS, and the web. To open the
          web version, press <Text style={styles.boldText}>w</Text> in the
          terminal running this project.
        </Text>
      </Collapsible>

      <Collapsible title="Images">
        <Text>
          For static images, you can use the{" "}
          <Text style={styles.boldText}>@2x</Text> and{" "}
          <Text style={styles.boldText}>@3x</Text> suffixes to provide files for
          different screen densities
        </Text>
        <Image
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          source={require("@/assets/images/react-logo.png")}
          style={{ alignSelf: "center" }}
        />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <Text style={styles.linkText}>Learn more</Text>
        </ExternalLink>
      </Collapsible>

      <Collapsible title="Custom fonts">
        <Text>
          Open <Text style={styles.boldText}>app/_layout.tsx</Text> to see how
          to load{" "}
          <Text style={{ fontFamily: "SpaceMono" }}>
            custom fonts such as this one.
          </Text>
        </Text>
        <ExternalLink href="https://docs.expo.dev/versions/latest/sdk/font">
          <Text style={styles.linkText}>Learn more</Text>
        </ExternalLink>
      </Collapsible>

      <Collapsible title="Light and dark mode components">
        <Text>
          This template has light and dark mode support. The{" "}
          <Text style={styles.boldText}>useColorScheme()</Text> hook lets you
          inspect what the user&apos;s current color scheme is, and so you can
          adjust UI colors accordingly.
        </Text>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <Text style={styles.linkText}>Learn more</Text>
        </ExternalLink>
      </Collapsible>

      <Collapsible title="Animations">
        <Text>
          This template includes an example of an animated component. The{" "}
          <Text style={styles.boldText}>components/HelloWave.tsx</Text>{" "}
          component uses the powerful{" "}
          <Text style={styles.boldText}>react-native-reanimated</Text> library
          to create a waving hand animation.
        </Text>
        {Platform.select({
          ios: (
            <Text>
              The{" "}
              <Text style={styles.boldText}>
                components/ParallaxScrollView.tsx
              </Text>{" "}
              component provides a parallax effect for the header image.
            </Text>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: Colors.light.primary,
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
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
  linkText: {
    color: Colors.light.primary,
    textDecorationLine: "underline",
  },
  protectedNotice: {
    backgroundColor: "#e8f5e8",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
});
