import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AuthScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const currentMode = mode || "login";

  const switchToLogin = () => {
    router.setParams({ mode: "login" });
  };

  const switchToRegister = () => {
    router.setParams({ mode: "register" });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <View
            style={[
              styles.avatar,
              {
                backgroundColor:
                  currentMode === "register" ? "#E5C6CC" : "#EEE",
              },
            ]}
          />
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            onPress={switchToLogin}
            style={[styles.tab, currentMode === "login" && styles.tabActive]}
          >
            <Text
              style={[
                styles.tabText,
                currentMode === "login" && styles.tabTextActive,
              ]}
            >
              Iniciar sesión
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={switchToRegister}
            style={[styles.tab, currentMode === "register" && styles.tabActive]}
          >
            <Text
              style={[
                styles.tabText,
                currentMode === "register" && styles.tabTextActive,
              ]}
            >
              Registrarme
            </Text>
          </TouchableOpacity>
        </View>

        {currentMode === "login" ? <LoginForm /> : <RegisterForm />}
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
    paddingHorizontal: Spacing["3xl"],
    paddingTop: Spacing["6xl"],
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
  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: Spacing.xl,
    borderBottomWidth: 1,
    borderColor: "#E5E5E5",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.lg,
  },
  tabActive: {
    borderBottomWidth: 3,
    borderColor: Colors.light.primary,
  },
  tabText: {
    color: Colors.light.text.primary,
    fontWeight: "500",
    fontSize: 16,
  },
  tabTextActive: {
    color: Colors.light.primary,
    fontWeight: "bold",
  },
});
