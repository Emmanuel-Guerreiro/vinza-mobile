import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/spacing";
import { CompleteProfileForm } from "@/modules/user/components/complete-profile-form";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function CompleteProfilePage() {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.content}>
        {/* Top Section - Gray */}
        <View style={styles.topSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar} />
          </View>
          <View style={styles.tabContainer}>
            <View style={styles.tab}>
              <Text style={styles.tabTextActive}>Completa tu perfil</Text>
            </View>
          </View>
        </View>
        {/* Bottom Section - White */}
        <View style={styles.bottomSection}>
          <CompleteProfileForm />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
  },
  topSection: {
    backgroundColor: Colors.light.gray.secondary,
    paddingHorizontal: Spacing["3xl"],
    paddingTop: Spacing["6xl"],
    paddingBottom: Spacing["2xl"],
  },
  bottomSection: {
    flex: 1,
    backgroundColor: Colors.light.white,
    paddingHorizontal: Spacing["3xl"],
    paddingTop: Spacing["2xl"],
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#EEE",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderColor: Colors.light.gray.primary,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.lg,
    borderBottomWidth: 3,
    borderColor: Colors.light.primary,
  },
  tabTextActive: {
    color: Colors.light.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
});
