import { Colors } from "@/constants/Colors";
import { ROUTES } from "@/constants/Routes";
import { BorderRadius, Spacing } from "@/constants/Spacing";
import { useSession } from "@/lib/context";
import { validateAccount } from "@/modules/auth/api";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { OtpInput } from "react-native-otp-entry";

export default function ValidatePage() {
  const { session, signOut } = useSession();
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const otpRef = useRef(null);
  const handleValidate = async () => {
    if (!otp || otp.length < 6) {
      setError("Por favor ingresa el código completo.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      if (!session?.email) {
        setError("No se encontró el email de la sesión.");
        setLoading(false);
        return;
      }
      const response = await validateAccount({
        code: otp,
        email: session.email,
      });
      if (response.ok) {
        router.replace(ROUTES["APP_TABS"]);
      } else {
        const data = await response.json();
        setError(data?.message || "Código incorrecto.");
      }
    } catch {
      setError("Error al validar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    // TODO: Implement resend code logic
    Alert.alert("Reenviar código", "Funcionalidad no implementada.");
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace(ROUTES["AUTH"]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "position" : undefined}
    >
      <View style={styles.card}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar} />
        </View>
        <Text style={styles.title}>Validar cuenta</Text>
        <Text style={styles.subtitle}>
          Escribe el código que te enviamos a{"\n"}
          <Text style={styles.email}>{session?.email}</Text>
        </Text>
        <OtpInput
          ref={otpRef}
          numberOfDigits={6}
          focusColor={Colors.light.primary}
          autoFocus={false}
          onTextChange={(value) => {
            setOtp(value.toUpperCase());
          }}
          type="alphanumeric"
          theme={{
            containerStyle: {
              marginVertical: Spacing.xl,
              width: "auto",
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
            },
            pinCodeContainerStyle: {
              borderWidth: 1,
              borderColor: Colors.light.text.secondary,
              borderRadius: BorderRadius.md,
              width: 40,
              height: 48,
              marginHorizontal: 4,
              backgroundColor: "#fff",
              justifyContent: "center",
              alignItems: "center",
              borderStyle: "dashed",
            },
            pinCodeTextStyle: {
              fontSize: 24,
              color: Colors.light.text.primary,
            },
            focusedPinCodeContainerStyle: {
              borderColor: Colors.light.primary,
            },
          }}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity style={styles.resend} onPress={handleResend}>
          <Text style={styles.resendText}>Reenviar código</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Cerrar sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.validateButton, loading && { opacity: 0.7 }]}
          onPress={handleValidate}
          disabled={loading}
        >
          <Text style={styles.validateButtonText}>Validar cuenta</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#232222",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: Spacing["3xl"],
    width: 340,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#EEE",
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: Colors.light.text.primary,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: Colors.light.text.secondary,
    marginBottom: Spacing.xl,
    textAlign: "center",
  },
  email: {
    fontWeight: "bold",
    color: Colors.light.primary,
  },
  resend: {
    marginVertical: Spacing.md,
  },
  resendText: {
    color: Colors.light.primary,
    textDecorationLine: "underline",
    fontSize: 14,
    textAlign: "center",
  },
  signOutButton: {
    borderWidth: 1,
    borderColor: Colors.light.primary,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
    alignItems: "center",
    width: "100%",
  },
  signOutText: {
    color: Colors.light.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
  validateButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: "center",
    width: "100%",
    marginTop: Spacing.md,
  },
  validateButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  error: {
    color: "#B00020",
    marginBottom: Spacing.md,
    textAlign: "center",
  },
});
