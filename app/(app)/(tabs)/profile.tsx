import { Colors } from "@/constants/Colors";
import { PasswordUpdateForm } from "@/modules/user/components/PasswordUpdateForm";
import { ProfileView } from "@/modules/user/components/ProfileData";
import dayjs from "dayjs";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSession } from "../../../lib/context";

export default function ProfileScreen() {
  const { session } = useSession();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handlePasswordSuccess = () => {
    setShowPasswordForm(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleBackToProfile = () => {
    setShowPasswordForm(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar} />
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
    paddingTop: "20%",
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
    backgroundColor: Colors.light.gray.primary,
    marginRight: 16,
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
