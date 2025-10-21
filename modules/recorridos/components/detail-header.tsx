import { Spacing } from "@/constants/spacing";
import { Href } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface DetailHeaderProps {
  title: string;
  fallbackRoute?: Href;
  children?: React.ReactNode;
}

export function DetailHeader({ title, children }: DetailHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {children}
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
