import { Colors } from "@/constants/Colors";
import { BorderRadius, Spacing } from "@/constants/Spacing";
import { useSession } from "@/lib/context";
import { TermsModal } from "@/modules/auth/components/TermsModal";
import { RegisterRequestSchema } from "@/modules/auth/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

// Extend RegisterRequestSchema to include confirmPassword and match password
const RegisterFormSchema = RegisterRequestSchema.extend({
  confirmPassword: z.string().min(1, "Confirma tu contraseña"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export const RegisterForm: React.FC = () => {
  const { signUp } = useSession();
  const router = useRouter();
  const [termsVisible, setTermsVisible] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await signUp({
        email: data.email,
        password: data.password,
        name: data.email.split("@")[0],
      });
      router.replace("/(app)/(tabs)/explore");
    } catch {
      Alert.alert("Error", "Failed to sign up");
    }
  };

  return (
    <>
      <View style={styles.form}>
        <Text style={styles.label}>Correo electrónico</Text>
        <Controller
          control={control}
          name="email"
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

        <Text style={[styles.label, { marginTop: Spacing.lg }]}>
          Contraseña
        </Text>
        <Controller
          control={control}
          name="password"
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

        <Text style={[styles.label, { marginTop: Spacing.lg }]}>
          Repetir contraseña
        </Text>
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[
                styles.input,
                errors.confirmPassword && styles.inputError,
              ]}
              placeholder="********"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              placeholderTextColor={Colors.light.text.secondary}
            />
          )}
        />
        {errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
        )}

        <TouchableOpacity
          style={styles.termsButton}
          onPress={() => setTermsVisible(true)}
        >
          <Text style={styles.termsText}>Términos y condiciones</Text>
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
            {isSubmitting ? "Registrando..." : "Registrarme"}
          </Text>
        </TouchableOpacity>
      </View>
      <TermsModal
        visible={termsVisible}
        onClose={() => setTermsVisible(false)}
      />
    </>
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
  termsButton: {
    marginTop: Spacing.xl,
    alignItems: "center",
  },
  termsText: {
    color: Colors.light.primary,
    fontSize: 14,
    textDecorationLine: "underline",
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
