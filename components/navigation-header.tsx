import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/spacing";
import { Href } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface NavigationHeaderProps {
  title: string;
  fallbackRoute?: Href;
}

export function NavigationHeader({ title }: NavigationHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 100,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.light.primary,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Spacing["xl"],
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.white,
    flex: 1,
  },
});
