import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ROUTES } from "@/constants/routes";
import { useSession } from "../lib/context";

export default function HomeScreen() {
  const router = useRouter();
  const { session, isLoading } = useSession();

  // Redirect authenticated users to the internal app
  useEffect(() => {
    if (!isLoading && session && session.validado) {
      router.replace(ROUTES["APP_TABS"]);
    }
  }, [session, isLoading, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return null;
  }

  // Don't render if user is authenticated (they'll be redirected)
  if (session) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Top Section with Logo and Text */}
      <View style={styles.topSection}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>V</Text>
          </View>
          <Text style={styles.brandText}>VINZA</Text>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>
            Conoce{"\n"}la{" "}
            <Text style={styles.experienciaText}>experiencia</Text>
            {"\n"}del vino
          </Text>
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/auth?mode=login")}
        >
          <Text style={styles.loginButtonText}>Iniciar sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/auth?mode=register")}
          style={styles.registerContainer}
        >
          <Text style={styles.registerText}>
            ¿Aún no tienes cuenta?{" "}
            <Text style={styles.registerLink}>Regístrate</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8B1538", // Wine red background
    paddingHorizontal: 20, // Horizontal padding (well above the minimum of 4)
    paddingTop: 60, // Top padding for status bar
  },
  topSection: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  logoCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8B1538",
  },
  brandText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    letterSpacing: 1.5,
  },
  titleContainer: {
    alignSelf: "flex-start",
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: "300",
    color: "#fff",
    textAlign: "left",
    lineHeight: 40,
  },
  experienciaText: {
    fontSize: 32,
    fontWeight: "300",
    color: "#FF69B4", // Pink color for "experiencia"
    lineHeight: 40,
  },
  bottomContainer: {
    paddingBottom: 60, // Increased bottom padding
    paddingHorizontal: 20,
  },
  loginButton: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#8B1538",
    fontSize: 16,
    fontWeight: "600",
  },
  registerContainer: {
    alignItems: "center",
  },
  registerText: {
    color: "#fff",
    fontSize: 14,
  },
  registerLink: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
