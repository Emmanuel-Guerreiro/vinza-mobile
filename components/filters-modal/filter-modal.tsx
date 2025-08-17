import React from "react";
import { BaseFilterModal } from "./base-filter-modal";
import { FilterModalContent } from "./filter-modal-content";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  onConfirm?: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  title,
  onConfirm,
}) => {
  return (
    <BaseFilterModal visible={visible} onClose={onClose}>
      <FilterModalContent
        title={title}
        onConfirm={onConfirm}
        onClose={onClose}
      />
    </BaseFilterModal>
  );
};
