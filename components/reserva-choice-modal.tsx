import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/spacing";
import { router } from "expo-router";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ReservaChoiceModalProps {
  visible: boolean;
  onClose: () => void;
  instanciaEventoId: number;
}

export function ReservaChoiceModal({
  visible,
  onClose,
  instanciaEventoId,
}: ReservaChoiceModalProps) {
  const handleAddToRecorrido = () => {
    onClose();
    router.push(`/select-recorrido?instanciaEventoId=${instanciaEventoId}`);
  };

  const handleCreateNewRecorrido = () => {
    onClose();
    router.push(`/crear-recorrido?instanciaEventoId=${instanciaEventoId}`);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={styles.title}>
            ¿Quieres crear un nuevo recorrido o prefieres agregarlo a un
            recorrido que ya tienes?
          </Text>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleAddToRecorrido}
            >
              <Text style={styles.secondaryButtonText}>
                Agregar a un recorrido
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleCreateNewRecorrido}
            >
              <Text style={styles.primaryButtonText}>
                Crear un nuevo recorrido
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
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
    borderRadius: 16,
    padding: Spacing.xl,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text.primary,
    textAlign: "center",
    marginBottom: Spacing.xl,
    lineHeight: 24,
  },
  buttonsContainer: {
    width: "100%",
    gap: Spacing.md,
  },
  primaryButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  primaryButtonText: {
    color: Colors.light.white,
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: Colors.light.white,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: Colors.light.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});
