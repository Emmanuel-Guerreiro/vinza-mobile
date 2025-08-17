import React, { createContext, ReactNode, useContext, useState } from "react";

interface FilterModalContextType {
  isVisible: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const FilterModalContext = createContext<FilterModalContextType | undefined>(
  undefined,
);

interface FilterModalProviderProps {
  children: ReactNode;
  initialState?: boolean;
}

export const FilterModalProvider: React.FC<FilterModalProviderProps> = ({
  children,
  initialState,
}) => {
  const [isVisible, setIsVisible] = useState(initialState ?? false);

  const openModal = () => setIsVisible(true);
  const closeModal = () => setIsVisible(false);

  return (
    <FilterModalContext.Provider value={{ isVisible, openModal, closeModal }}>
      {children}
    </FilterModalContext.Provider>
  );
};

const useFilterModalContext = (): FilterModalContextType => {
  const context = useContext(FilterModalContext);
  if (!context) {
    throw new Error("useFilterModal must be used within a FilterModalProvider");
  }
  return context;
};

export const useFilterModal = () => {
  const { isVisible, openModal, closeModal } = useFilterModalContext();

  return {
    isVisible,
    openModal,
    closeModal,
  };
};
