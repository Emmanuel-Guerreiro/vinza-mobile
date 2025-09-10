import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/spacing";
import React, { ReactNode } from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { IconSymbol } from "../ui/IconSymbol";
import { useFilterModal } from "./filter-modal-context";

interface BaseFilterModalProps {
  children: ReactNode;
}

export const FilterModalInternal: React.FC<BaseFilterModalProps> = ({
  children,
}) => {
  const { isVisible, closeModal, openModal } = useFilterModal();
  return (
    <>
      <TouchableOpacity style={styles.filterButton} onPress={openModal}>
        <IconSymbol name="camera.filters" size={20} color="#333" />
      </TouchableOpacity>
      <Modal
        visible={isVisible}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>{children}</View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.light.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    minHeight: 300,
  },
  filterButton: {
    padding: Spacing["1"],
  },
});
