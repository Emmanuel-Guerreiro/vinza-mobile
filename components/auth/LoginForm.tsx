import { Colors } from "@/constants/Colors";
import { BorderRadius, Spacing } from "@/constants/Spacing";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSession } from "../../ctx";

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginForm: React.FC = () => {
  const { signIn } = useSession();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await signIn(data.email, data.password);
      router.replace("/(app)/(tabs)/explore");
    } catch (error) {
      Alert.alert("Error", "Failed to sign in");
    }
  };

  return (
    <View style={styles.form}>
      <Text style={styles.label}>Correo electrónico</Text>
      <Controller
        control={control}
        name="email"
        rules={{
          required: "El correo electrónico es requerido",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Ingresa un correo electrónico válido",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="example@gmail.com"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={Colors.light.text.secondary}
          />
        )}
      />
      {errors.email && (
        <Text style={styles.errorText}>{errors.email.message}</Text>
      )}

      <Text style={[styles.label, { marginTop: Spacing.lg }]}>Contraseña</Text>
      <Controller
        control={control}
        name="password"
        rules={{
          required: "La contraseña es requerida",
          minLength: {
            value: 6,
            message: "La contraseña debe tener al menos 6 caracteres",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="********"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            placeholderTextColor={Colors.light.text.secondary}
          />
        )}
      />
      {errors.password && (
        <Text style={styles.errorText}>{errors.password.message}</Text>
      )}

      <TouchableOpacity style={styles.forgotButton}>
        <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.submitButton,
          isSubmitting && styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    marginTop: Spacing.xl,
  },
  label: {
    color: Colors.light.text.secondary,
    fontSize: 14,
    marginBottom: Spacing.sm,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: Colors.light.text.secondary,
    paddingVertical: Spacing.md,
    fontSize: 16,
    color: Colors.light.text.primary,
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: Spacing.xs,
  },
  forgotButton: {
    marginTop: Spacing.md,
    alignSelf: "flex-end",
  },
  forgotText: {
    color: Colors.light.primary,
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.xl,
    alignItems: "center",
    marginTop: Spacing["3xl"],
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: Colors.light.background,
    fontWeight: "bold",
    fontSize: 18,
  },
});
