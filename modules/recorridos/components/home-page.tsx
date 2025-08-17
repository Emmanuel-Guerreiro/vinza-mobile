import { Colors } from "@/constants/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function RecorridosHomePage() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Recorridos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: Colors.light.text.primary,
  },
});
