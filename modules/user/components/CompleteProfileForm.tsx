import { Colors } from "@/constants/Colors";
import { ROUTES } from "@/constants/Routes";
import { BorderRadius, Spacing } from "@/constants/Spacing";
import { useSession } from "@/lib/context";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { updateUser } from "../api";
import { UpdateUser, UpdateUserSchema } from "../types";

export const CompleteProfileForm = () => {
  const router = useRouter();
  const { session, updateSessionUserData } = useSession();
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUser>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      fecha_nacimiento: undefined,
    },
  });
  const fecha_nacimiento = watch("fecha_nacimiento");

  const onSubmit = async (data: UpdateUser) => {
    if (!session) return;
    const response = await updateUser(session.id, data);
    updateSessionUserData(response);
    router.replace(ROUTES["APP_TABS"]);
  };

  return (
    <View style={styles.form}>
      <Text style={styles.label}>Nombre</Text>
      <Controller
        control={control}
        name="nombre"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.nombre && styles.inputError]}
            placeholder="Nombre"
            value={value || ""}
            onChangeText={onChange}
            onBlur={onBlur}
            autoCapitalize="words"
            placeholderTextColor={Colors.light.text.secondary}
          />
        )}
      />
      {errors.nombre && (
        <Text style={styles.errorText}>{errors.nombre.message}</Text>
      )}

      <Text style={[styles.label, { marginTop: Spacing.lg }]}>Apellido</Text>
      <Controller
        control={control}
        name="apellido"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.apellido && styles.inputError]}
            placeholder="Apellido"
            value={value || ""}
            onChangeText={onChange}
            onBlur={onBlur}
            autoCapitalize="words"
            placeholderTextColor={Colors.light.text.secondary}
          />
        )}
      />
      {errors.apellido && (
        <Text style={styles.errorText}>{errors.apellido.message}</Text>
      )}

      <Text style={[styles.label, { marginTop: Spacing.lg }]}>
        Fecha de nacimiento
      </Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowDatePicker(true)}
        activeOpacity={0.7}
      >
        <Text
          style={{
            color: fecha_nacimiento
              ? Colors.light.text.primary
              : Colors.light.text.secondary,
          }}
        >
          {fecha_nacimiento
            ? new Date(fecha_nacimiento).toLocaleDateString()
            : "Selecciona una fecha"}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={fecha_nacimiento ? new Date(fecha_nacimiento) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event: DateTimePickerEvent, date?: Date) => {
            setShowDatePicker(false);
            if (date)
              setValue("fecha_nacimiento", date, { shouldValidate: true });
          }}
          maximumDate={new Date()}
        />
      )}
      {errors.fecha_nacimiento && (
        <Text style={styles.errorText}>{errors.fecha_nacimiento.message}</Text>
      )}

      <TouchableOpacity
        style={[
          styles.submitButton,
          isSubmitting && styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        <Text style={styles.submitButtonText}>Completar mi perfil</Text>
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
