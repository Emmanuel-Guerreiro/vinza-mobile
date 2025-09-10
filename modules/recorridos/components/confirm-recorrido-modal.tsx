import { Colors } from "@/constants/colors";
import {
  BorderRadius,
  FontWeights,
  Spacing,
  TextSizes,
} from "@/constants/spacing";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  confirmarRecorrido,
} from "../api";

interface ConfirmRecorridoModalProps {
  visible: boolean;
  onClose: () => void;
  id: number;
}

export function ConfirmRecorridoModal({
  visible,
  onClose,
  id,
}: ConfirmRecorridoModalProps) {
  const queryClient = useQueryClient();

  const confirmRecorridoMutation = useMutation({
    mutationFn: confirmarRecorrido,
    onSuccess: () => {
      // Invalidate queries
      queryClient.invalidateQueries({
        queryKey: [RECORRIDOS_QUERY_KEY],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [BOOKING_QUERY_KEY],
        exact: false,
      });
      onClose();
    },
  });

  const handleConfirm = () => {
    confirmRecorridoMutation.mutate(id);
  };

  return (
    <Modal visible={visible} onRequestClose={onClose} transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>
            ¿Estas seguro de confirmar este recorrido?
          </Text>
          <Text style={styles.warning}>
            Al confirmar un recorrido no se podrá modificar el orden de este
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
              disabled={confirmRecorridoMutation.isPending}
            >
              <Text style={styles.confirmButtonText}>
                {confirmRecorridoMutation.isPending
                  ? "Confirmando..."
                  : "Confirmar"}
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
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.light.text.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: TextSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.light.text.primary,
  },
  confirmButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: TextSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.light.white,
  },
});
