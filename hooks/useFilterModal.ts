import { useFilterModal as useFilterModalContext } from "@/contexts/filter-modal-context";

export const useFilterModal = () => {
  const { isVisible, openModal, closeModal } = useFilterModalContext();

  return {
    isVisible,
    openModal,
    closeModal,
  };
};
