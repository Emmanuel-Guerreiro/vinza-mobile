import { Colors } from "@/constants/colors";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useFilterModal } from "./filter-modal-context";

export const FilterConfirmButton = ({
  applyFilters,
}: {
  applyFilters: () => void;
}) => {
  const { closeModal } = useFilterModal();

  function handleConfirm() {
    applyFilters();
    closeModal();
  }
  return (
    <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
      <Text style={styles.confirmButtonText}>Confirmar</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  confirmButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  confirmButtonText: {
    color: Colors.light.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});
