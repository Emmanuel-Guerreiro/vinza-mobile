import { Spacing } from "@/constants/spacing";
import { Href } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface PuntuarHeaderProps {
  title: string;
  fallbackRoute?: Href;
}

export function PuntuarHeader({ title }: PuntuarHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
});
