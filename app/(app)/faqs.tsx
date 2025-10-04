import { Colors } from "@/constants/colors";
import { FaqsPage } from "@/modules/faq/components/faqs-page";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function FaqsScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Preguntas Frecuentes",
          headerStyle: {
            backgroundColor: Colors.light.background,
          },
          headerTintColor: Colors.light.text.primary,
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <FaqsPage />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
});
