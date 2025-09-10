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
import { BOOKING_QUERY_KEY, deleteBooking, RECORRIDOS_QUERY_KEY } from "../api";

interface DeleteBookingModalProps {
  visible: boolean;
  onClose: () => void;
  id: number;
}

export function DeleteBookingModal({
  visible,
  onClose,
  id,
}: DeleteBookingModalProps) {
  const queryClient = useQueryClient();
  const deleteBookingMutation = useMutation({
    mutationFn: () => deleteBooking(id),
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: [RECORRIDOS_QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: [BOOKING_QUERY_KEY] }),
      ]).then(() => onClose());
    },
  });

  const handleDelete = () => {
    deleteBookingMutation.mutate();
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
            ¿Estas seguro de eliminar este evento del recorrido?
          </Text>
          <Text style={styles.warning}>Esta acción es irreversible</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.volverButton} onPress={onClose}>
              <Text style={styles.volverButtonText}>Volver</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
              disabled={deleteBookingMutation.isPending}
            >
              <Text style={styles.deleteButtonText}>
                {deleteBookingMutation.isPending
                  ? "Eliminando..."
                  : "Eliminar recorrido"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const { width } = Dimensions.get("window");

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
    width: width * 0.9,
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
    textAlign: "center",
    fontSize: TextSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.light.text.primary,
    marginBottom: Spacing.sm,
    lineHeight: 24,
  },
  warning: {
    textAlign: "center",
    fontSize: TextSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.light.text.primary,
    marginBottom: Spacing["2xl"],
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
  deleteButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
  },
  deleteButtonText: {
    fontSize: TextSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.light.white,
  },
});
