import React, { ReactNode } from "react";
import { FilterModalInternal } from "./base-filter-internal";
import { FilterModalProvider } from "./filter-modal-context";

interface FilterModalProps {
  children: ReactNode;
}

export const FilterModal: React.FC<FilterModalProps> = ({ children }) => {
  return (
    <FilterModalProvider>
      <FilterModalInternal>{children}</FilterModalInternal>
    </FilterModalProvider>
  );
};
