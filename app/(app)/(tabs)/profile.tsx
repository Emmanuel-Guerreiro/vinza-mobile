import { Colors } from "@/constants/colors";
import { ROUTES } from "@/constants/routes";
import { PasswordUpdateForm } from "@/modules/user/components/password-update-form";
import { ProfileView } from "@/modules/user/components/profile-data";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSession } from "../../../lib/context";

export default function ProfileScreen() {
  const { session, signOut } = useSession();
  const router = useRouter();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const getInitials = (nombre?: string, apellido?: string): string => {
    const firstInitial = nombre?.charAt(0)?.toUpperCase() || "";
    const lastInitial = apellido?.charAt(0)?.toUpperCase() || "";
    return `${firstInitial}${lastInitial}`;
  };

  const handlePasswordSuccess = () => {
    setShowPasswordForm(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleBackToProfile = () => {
    setShowPasswordForm(false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace(ROUTES["AUTH"]);
  };

  const handleAyuda = () => {
    router.push("/faqs");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {getInitials(session?.nombre, session?.apellido)}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.desdeLabel}>Desde:</Text>
          <Text style={styles.desdeValue}>
            {session?.created_at
              ? dayjs(session.created_at).format("DD/MM/YYYY")
              : "-"}
          </Text>
        </View>
      </View>

      {showPasswordForm ? (
        <PasswordUpdateForm
          onSuccess={handlePasswordSuccess}
          onBack={handleBackToProfile}
        />
      ) : (
        <ProfileView onChangePassword={() => setShowPasswordForm(true)} />
      )}

      {!showPasswordForm && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.ayudaButton} onPress={handleAyuda}>
            <Text style={styles.ayudaText}>Ayuda</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Text style={styles.signOutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      )}

      {showToast && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>Contraseña cambiada exitosamente</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: "20%",
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 8,
    paddingHorizontal: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.light.primary,
    marginRight: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: Colors.light.white,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerInfo: {
    alignItems: "flex-end",
    flex: 1,
  },
  desdeLabel: {
    color: Colors.light.text.secondary,
    fontSize: 14,
  },
  desdeValue: {
    color: Colors.light.text.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonsContainer: {
    paddingHorizontal: 24,
    marginTop: "auto",
    marginBottom: 40,
    gap: 12,
  },
  signOutButton: {
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EF4444",
  },
  signOutText: {
    color: "#DC2626",
    fontWeight: "bold",
    fontSize: 16,
  },
  ayudaButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  ayudaText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  toast: {
    position: "absolute",
    top: 40,
    left: 16,
    right: 16,
    backgroundColor: "#D1FADF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    flexDirection: "row",
    zIndex: 100,
    borderWidth: 1,
    borderColor: "#12B76A",
  },
  toastText: {
    color: "#039855",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
});
