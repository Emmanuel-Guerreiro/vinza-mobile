import { Colors } from "@/constants/colors";
import {
  BorderRadius,
  FontWeights,
  Spacing,
  TextSizes,
} from "@/constants/spacing";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BOOKING_QUERY_KEY, RECORRIDOS_QUERY_KEY, updateBooking } from "../api";
import { Reserva } from "../types";

interface UpdateBookingPeopleModalProps {
  visible: boolean;
  onClose: () => void;
  reserva: Reserva | null;
}

export function UpdateBookingPeopleModal({
  visible,
  onClose,
  reserva,
}: UpdateBookingPeopleModalProps) {
  const queryClient = useQueryClient();

  const [quantity, setQuantity] = useState(reserva?.cantidadGente || 1);

  // Get the maximum capacity from the evento
  const maxCapacity = reserva?.instanciaEvento?.evento?.cupo
    ? parseInt(reserva.instanciaEvento.evento.cupo)
    : 100; // Default fallback

  const updateBookingMutation = useMutation({
    mutationFn: async (cantidadGente: number) => {
      if (!reserva?.id) {
        return;
      }

      await updateBooking(reserva?.id, { cantidadGente });
      return;
    },
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: [RECORRIDOS_QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: [BOOKING_QUERY_KEY] }),
      ]).then(() => onClose());
    },
  });

  const handleUpdate = () => {
    if (reserva) {
      updateBookingMutation.mutate(quantity);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxCapacity) {
      setQuantity(quantity + 1);
    }
  };

  // Update quantity when reserva changes
  React.useEffect(() => {
    if (reserva) {
      setQuantity(reserva.cantidadGente);
    }
  }, [reserva]);

  const isDecreaseDisabled = quantity <= 1;
  const isIncreaseDisabled = quantity >= maxCapacity;

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
      transparent
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Modificar cantidad de personas</Text>

          <View style={styles.quantitySelector}>
            <TouchableOpacity
              style={[
                styles.quantityButton,
                isDecreaseDisabled && styles.disabledButton,
              ]}
              onPress={handleDecrease}
              disabled={isDecreaseDisabled}
            >
              <Text
                style={[
                  styles.quantityButtonText,
                  isDecreaseDisabled && styles.disabledButtonText,
                ]}
              >
                -
              </Text>
            </TouchableOpacity>

            <View style={styles.quantityDisplay}>
              <Text style={styles.quantityText}>{quantity}</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.quantityButton,
                isIncreaseDisabled && styles.disabledButton,
              ]}
              onPress={handleIncrease}
              disabled={isIncreaseDisabled}
            >
              <Text
                style={[
                  styles.quantityButtonText,
                  isIncreaseDisabled && styles.disabledButtonText,
                ]}
              >
                +
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleUpdate}
              disabled={updateBookingMutation.isPending}
            >
              <Text style={styles.updateButtonText}>
                {updateBookingMutation.isPending
                  ? "Actualizando..."
                  : "Cambiar cantidad"}
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
    marginBottom: Spacing["2xl"],
    textAlign: "center",
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing["2xl"],
    gap: Spacing.md,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.light.gray.primary,
    backgroundColor: Colors.light.white,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: Colors.light.gray.secondary,
    borderColor: Colors.light.gray.primary,
  },
  quantityButtonText: {
    fontSize: TextSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.light.text.primary,
  },
  disabledButtonText: {
    color: Colors.light.text.secondary,
  },
  quantityDisplay: {
    width: 60,
    height: 40,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.light.gray.primary,
    backgroundColor: Colors.light.white,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: TextSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.light.text.primary,
  },
  buttonContainer: {
    gap: Spacing.md,
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.light.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: TextSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.light.primary,
  },
  updateButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
  },
  updateButtonText: {
    fontSize: TextSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.light.white,
  },
});
