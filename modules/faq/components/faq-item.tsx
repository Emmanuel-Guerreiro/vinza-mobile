import { Colors } from "@/constants/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Faq } from "../types";

interface FaqItemProps {
  faq: Faq;
}

export function FaqItem({ faq }: FaqItemProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.question}>{faq.question}</Text>
      <Text style={styles.answer}>{faq.answer}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray.secondary,
  },
  question: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.text.primary,
    marginBottom: 8,
    lineHeight: 22,
  },
  answer: {
    fontSize: 14,
    color: Colors.light.text.secondary,
    lineHeight: 20,
  },
});
