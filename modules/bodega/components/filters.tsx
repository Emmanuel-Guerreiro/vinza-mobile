import { FilterModal } from "@/components/filters-modal";
import { FilterConfirmButton } from "@/components/filters-modal/filter-confirm-button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function BodegasFilters({ applyFilters }: { applyFilters: () => void }) {
  return (
    <FilterModal>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Filtrar bodegas</Text>
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Puntuación mínima</Text>
        <TouchableOpacity style={styles.filterInput}>
          <Text style={styles.filterInputText}>4 Estrellas</Text>
          <IconSymbol name="chevron.down" size={16} color="#666" />
        </TouchableOpacity>
      </View>

      <FilterConfirmButton applyFilters={applyFilters} />
    </FilterModal>
  );
}

const styles = StyleSheet.create({
  modalHeader: {
    alignItems: "center",
    marginBottom: 30,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  filterSection: {
    marginBottom: 30,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  filterInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  filterInputText: {
    fontSize: 16,
    color: "#333",
  },
});
