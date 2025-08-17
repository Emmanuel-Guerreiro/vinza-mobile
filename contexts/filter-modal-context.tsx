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
}

export const FilterModalProvider: React.FC<FilterModalProviderProps> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const openModal = () => setIsVisible(true);
  const closeModal = () => setIsVisible(false);

  return (
    <FilterModalContext.Provider value={{ isVisible, openModal, closeModal }}>
      {children}
    </FilterModalContext.Provider>
  );
};

export const useFilterModal = (): FilterModalContextType => {
  const context = useContext(FilterModalContext);
  if (!context) {
    throw new Error("useFilterModal must be used within a FilterModalProvider");
  }
  return context;
};
