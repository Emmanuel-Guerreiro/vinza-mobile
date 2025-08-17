import { Colors } from "@/constants/colors";
import dayjs from "dayjs";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSession } from "../../../lib/context";

interface Props {
  onChangePassword: () => void;
}

export function ProfileView({ onChangePassword }: Props) {
  const { session } = useSession();
  return (
    <View style={styles.container}>
      <View style={styles.formSection}>
        <Text style={styles.label}>Nombre</Text>
        <Text style={styles.value}>
          {session?.nombre || "-"} {session?.apellido || ""}
        </Text>
        <Text style={styles.label}>Correo electrónico</Text>
        <Text style={[styles.value, styles.email]}>
          {session?.email || "-"}
        </Text>
        <Text style={styles.label}>Contraseña</Text>
        <Text style={styles.value}>*********</Text>
        <Text style={styles.label}>Fecha de nacimiento</Text>
        <Text style={styles.value}>
          {session?.fecha_nacimiento
            ? dayjs(session.fecha_nacimiento).format("DD/MM/YYYY")
            : "-"}
        </Text>
      </View>
      <TouchableOpacity onPress={onChangePassword} style={styles.linkButton}>
        <Text style={styles.linkText}>Cambiar contraseña</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Guardar cambios</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  formSection: {
    marginBottom: 16,
  },
  label: {
    color: Colors.light.text.secondary,
    fontSize: 14,
    marginTop: 16,
  },
  value: {
    color: Colors.light.text.primary,
    fontSize: 16,
    marginBottom: 4,
    marginTop: 2,
  },
  email: {
    fontWeight: "bold",
  },
  linkButton: {
    marginTop: 24,
    alignItems: "center",
  },
  linkText: {
    color: Colors.light.primary,
    fontWeight: "bold",
    textDecorationLine: "underline",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 32,
  },
  saveButtonText: {
    color: Colors.light.background,
    fontWeight: "bold",
    fontSize: 18,
  },
});
