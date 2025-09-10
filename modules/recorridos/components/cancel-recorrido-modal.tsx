import { Colors } from "@/constants/colors";
import {
  BorderRadius,
  FontWeights,
  Spacing,
  TextSizes,
} from "@/constants/spacing";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  BOOKING_QUERY_KEY,
  RECORRIDOS_QUERY_KEY,
  cancelarRecorrido,
} from "../api";

interface CancelRecorridoModalProps {
  visible: boolean;
  onClose: () => void;
  id: number;
}

export function CancelRecorridoModal({
  visible,
  onClose,
  id,
}: CancelRecorridoModalProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const cancelRecorridoMutation = useMutation({
    mutationFn: cancelarRecorrido,
    onSuccess: () => {
      // Invalidate queries

      queryClient.invalidateQueries({ queryKey: [RECORRIDOS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [BOOKING_QUERY_KEY] });

      // Redirect to recorridos tab
      router.push("/(app)/(tabs)/home?tab=recorridos");
    },
  });

  const handleCancel = () => {
    cancelRecorridoMutation.mutate(id);
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
      transparent
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>
            ¿Estas seguro de cancelar este recorrido?
          </Text>
          <Text style={styles.warning}>Esta acción es irreversible</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.volverButton} onPress={onClose}>
              <Text style={styles.volverButtonText}>Volver</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              disabled={cancelRecorridoMutation.isPending}
            >
              <Text style={styles.cancelButtonText}>
                {cancelRecorridoMutation.isPending
                  ? "Cancelando..."
                  : "Cancelar recorrido"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
  },
  modalContainer: {
    backgroundColor: Colors.light.white,
    borderRadius: BorderRadius["2xl"],
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing["2xl"],
    width: Dimensions.get("window").width * 0.9,
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 8,
  },
  title: {
    fontSize: TextSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.light.text.primary,
    marginBottom: Spacing.sm,
    textAlign: "center",
    lineHeight: 24,
  },
  warning: {
    fontSize: TextSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.light.text.primary,
    marginBottom: Spacing["2xl"],
    textAlign: "center",
    lineHeight: 20,
  },
  buttonContainer: {
    gap: Spacing.md,
  },
  volverButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.light.text.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
  },
  volverButtonText: {
    fontSize: TextSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.light.text.primary,
  },
  cancelButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: TextSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.light.white,
  },
});
