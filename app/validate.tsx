import { Colors } from "@/constants/Colors";
import { ROUTES } from "@/constants/Routes";
import { BorderRadius, Spacing } from "@/constants/Spacing";
import { useSession } from "@/lib/context";
import { requestValidation } from "@/modules/auth/api";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { OtpInput } from "react-native-otp-entry";

export default function ValidatePage() {
  const { session, signOut, validateAccount } = useSession();
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpRef = useRef(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

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
      await validateAccount({
        code: otp,
        email: session.email,
      });
      router.replace(ROUTES["COMPLETE_PROFILE"]);
    } catch {
      setError("Error al validar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!session?.email) {
      setError("No se encontró el email de la sesión.");
      return;
    }
    if (resendCooldown > 0) return;
    requestValidation(session.email);
    setResendCooldown(45);
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace(ROUTES["AUTH"]);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
                <Text style={styles.tabTextActive}>Validar cuenta</Text>
              </View>
            </View>
          </View>

          {/* Bottom Section - White */}
          <View style={styles.bottomSection}>
            <Text style={styles.subtitle}>
              Escribe el código que te enviamos a{"\n"}
              <Text style={styles.email}>{session?.email}</Text>
            </Text>

            <View style={styles.otpContainer}>
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
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  },
                  pinCodeContainerStyle: {
                    borderWidth: 1,
                    borderColor: Colors.light.text.secondary,
                    borderRadius: BorderRadius.md,
                    width: 45,
                    height: 55,
                    backgroundColor: "#fff",
                    justifyContent: "center",
                    alignItems: "center",
                    borderStyle: "dashed",
                  },
                  pinCodeTextStyle: {
                    fontSize: 20,
                    color: Colors.light.text.primary,
                    fontWeight: "bold",
                  },
                  focusedPinCodeContainerStyle: {
                    borderColor: Colors.light.primary,
                    borderWidth: 2,
                  },
                }}
              />
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              style={styles.resend}
              onPress={handleResend}
              disabled={resendCooldown > 0}
            >
              <Text style={styles.resendText}>
                {resendCooldown > 0
                  ? `Reenviar código (${resendCooldown}s)`
                  : "Reenviar código"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signOutButton}
              onPress={handleSignOut}
            >
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
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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
    backgroundColor: Colors.light.white,
    paddingHorizontal: Spacing["3xl"],
    paddingTop: Spacing["6xl"],
  },
  bottomSection: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: Colors.light.gray.secondary,
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
  otpContainer: {
    width: "100%",
    marginBottom: Spacing.lg,
  },
  resend: {
    marginVertical: Spacing.md,
    alignItems: "center",
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
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.xl,
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
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.xl,
    alignItems: "center",
    width: "100%",
    marginTop: Spacing.md,
  },
  validateButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  error: {
    color: "#FF3B30",
    marginBottom: Spacing.md,
    textAlign: "center",
    fontSize: 14,
  },
});
