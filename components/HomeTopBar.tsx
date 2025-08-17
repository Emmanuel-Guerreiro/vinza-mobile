import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/colors";
import { FontWeights, Spacing, TextSizes } from "@/constants/spacing";
import { useSession } from "@/lib/context";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function HomeTopBar({
  current,
  setCurrentTab,
}: {
  current: "eventos" | "bodegas" | "recorridos";
  setCurrentTab: (tab: "eventos" | "bodegas" | "recorridos") => void;
}) {
  const router = useRouter();
  const { session } = useSession();

  return (
    <View style={styles.container}>
      {/* Greeting and Profile */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          ¡Hola de nuevo <Text style={styles.userName}>{session?.nombre}</Text>!
        </Text>
        <TouchableOpacity
          onPress={() => {
            router.push("/(app)/(tabs)/profile");
          }}
          style={styles.profileButton}
        >
          <IconSymbol name="person.fill" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => {
            setCurrentTab("eventos");
          }}
        >
          <Text
            style={[
              styles.tabText,
              current === "eventos" && styles.activeTabText,
            ]}
          >
            Eventos
          </Text>
          {current === "eventos" && <View style={styles.activeIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => {
            setCurrentTab("bodegas");
          }}
        >
          <Text
            style={[
              styles.tabText,
              current === "bodegas" && styles.activeTabText,
            ]}
          >
            Bodegas
          </Text>
          {current === "bodegas" && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => {
            setCurrentTab("recorridos");
          }}
        >
          <Text
            style={[
              styles.tabText,
              current === "recorridos" && styles.activeTabText,
            ]}
          >
            Recorridos
          </Text>
          {current === "recorridos" && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.white,
    paddingTop: 50, // Account for status bar
    paddingHorizontal: 20,
    paddingBottom: Spacing.sm,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: TextSizes.xl,
    fontWeight: FontWeights.semibold,
    color: Colors.light.text.primary,
  },
  userName: {
    color: Colors.light.primary, // Purple color for the name
  },
  profileButton: {
    padding: Spacing.sm,
  },
  tabsContainer: {
    flexDirection: "row",
    gap: Spacing.lg,
    justifyContent: "space-around",
  },
  tab: {
    position: "relative",
    paddingVertical: 8,
    paddingBottom: Spacing.md,
  },
  tabText: {
    fontSize: TextSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.light.text.primary,
  },
  activeTabText: {
    fontWeight: FontWeights.semibold,
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: Colors.light.primary,
    borderRadius: 2,
  },
});
