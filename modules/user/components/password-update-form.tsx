import { Colors } from "@/constants/colors";
import { ApiError } from "@/lib/error";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { changePassword } from "../api";
import { ChangePasswordForm, changePasswordFormSchema } from "../types";

interface Props {
  onSuccess: () => void;
  onBack: () => void;
}

export const PasswordUpdateForm = ({ onSuccess, onBack }: Props) => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordFormSchema),
  });

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      onSuccess();
    },
    onError: (error: Error) => {
      try {
        const errorData = error as unknown as ApiError;
        if (errorData.key === "app.auth.current_password_mismatch") {
          setError("currentPassword", {
            type: "manual",
            message: errorData.message,
          });
        }
      } catch {
        // If parsing fails, show a generic error
        setError("root", {
          type: "manual",
          message: "Error al cambiar la contraseña",
        });
      }
    },
  });

  const onSubmit = (data: ChangePasswordForm) => {
    changePasswordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>Cambiar contraseña</Text>
      <View style={styles.formSection}>
        <Text style={styles.label}>Contraseña actual</Text>
        <Controller
          control={control}
          name="currentPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              placeholder="Ingresa tu contraseña actual"
            />
          )}
        />
        {errors.currentPassword && (
          <Text style={styles.errorText}>{errors.currentPassword.message}</Text>
        )}

        <Text style={styles.label}>Nueva contraseña</Text>
        <Controller
          control={control}
          name="newPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              placeholder="Ingresa tu nueva contraseña"
            />
          )}
        />
        {errors.newPassword && (
          <Text style={styles.errorText}>{errors.newPassword.message}</Text>
        )}

        <Text style={styles.label}>Repetir nueva contraseña</Text>
        <Controller
          control={control}
          name="repeatPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              placeholder="Repite tu nueva contraseña"
            />
          )}
        />
        {errors.repeatPassword && (
          <Text style={styles.errorText}>{errors.repeatPassword.message}</Text>
        )}

        {errors.root && (
          <Text style={styles.errorText}>{errors.root.message}</Text>
        )}
      </View>
      <TouchableOpacity
        style={[
          styles.saveButton,
          changePasswordMutation.isPending && styles.saveButtonDisabled,
        ]}
        onPress={handleSubmit(onSubmit)}
        disabled={changePasswordMutation.isPending}
      >
        <Text style={styles.saveButtonText}>
          {changePasswordMutation.isPending
            ? "Cambiando contraseña..."
            : "Confirmar cambio de contraseña"}
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
  saveButtonDisabled: {
    backgroundColor: Colors.light.text.secondary,
    opacity: 0.6,
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
