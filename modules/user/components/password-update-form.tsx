import { Colors } from "@/constants/colors";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  onSuccess: () => void;
  onBack: () => void;
}

export const PasswordUpdateForm = ({ onSuccess, onBack }: Props) => {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [repeat, setRepeat] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!current || !newPass || !repeat) {
      setError("Completa todos los campos");
      return;
    }
    if (newPass !== repeat) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>Cambiar contraseña</Text>
      <View style={styles.formSection}>
        <Text style={styles.label}>Contraseña actual</Text>
        <TextInput
          style={styles.input}
          value={current}
          onChangeText={setCurrent}
          secureTextEntry
        />
        <Text style={styles.label}>Nueva contraseña</Text>
        <TextInput
          style={styles.input}
          value={newPass}
          onChangeText={setNewPass}
          secureTextEntry
        />
        <Text style={styles.label}>Repetir nueva contraseña</Text>
        <TextInput
          style={styles.input}
          value={repeat}
          onChangeText={setRepeat}
          secureTextEntry
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.saveButtonText}>
          Confirmar cambio de contraseña
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onBack} style={styles.cancelButton}>
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
};

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
  cancelButton: {
    marginTop: 16,
    alignItems: "center",
  },
  cancelButtonText: {
    color: Colors.light.text.secondary,
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    borderBottomWidth: 1,
    borderColor: Colors.light.text.secondary,
    paddingVertical: 8,
    fontSize: 16,
    color: Colors.light.text.primary,
    marginBottom: 8,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 8,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: Colors.light.text.primary,
  },
});
