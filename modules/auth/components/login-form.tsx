import { Colors } from "@/constants/colors";
import { ROUTES } from "@/constants/routes";
import { BorderRadius, Spacing } from "@/constants/spacing";
import { useSession } from "@/lib/context";
import { LoginRequestSchema } from "@/modules/auth/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Toast } from "toastify-react-native";

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginForm: React.FC = () => {
  const { signIn, session } = useSession();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(LoginRequestSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await signIn(data);
      router.replace(
        response.validado ? ROUTES["APP_TABS"] : ROUTES["VALIDATE"],
      );
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Error al iniciar sesión",
        text2: "Email o contraseña no coinciden",
      });
    }
  };

  return (
    <View style={styles.form}>
      <Text style={styles.label}>Correo electrónico {session?.email}</Text>
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

      <Text style={[styles.label, { marginTop: Spacing.lg }]}>Contraseña</Text>
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
