import { FilterModal } from "@/components/filters-modal";
import { SearchBar } from "@/components/searchbar";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/spacing";
import { BODERGA_QUERY_KEY, getBodegas } from "@/modules/bodega/api";
import { BodegaCard } from "@/modules/bodega/components/card";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  VirtualizedList,
} from "react-native";
import { Bodega } from "../types";

export function BodegaHomePage() {
  const [search, setSearch] = useState("");
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const { data, isLoading, isFetching, refetch } = useInfiniteQuery({
    queryKey: [
      BODERGA_QUERY_KEY,
      {
        page: 1,
        limit: 10,
        nombre: search,
      },
    ],
    queryFn: () =>
      getBodegas({
        page: 1,
        limit: 1,
        nombre: search,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.meta.currentPage === lastPage.meta.totalPages
        ? undefined
        : lastPage.meta.currentPage + 1,
    initialPageParam: 1,
  });

  const bodegasItems = useMemo(
    () => data?.pages.flatMap((page) => page.items),
    [data?.pages?.length],
  );

  const openFilterModal = () => setIsFilterModalVisible(true);
  const closeFilterModal = () => setIsFilterModalVisible(false);

  const handleFilterConfirm = () => {
    // Handle filter confirmation logic here
    // TODO: Implement filter logic
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.searchFiltersContainer}>
          <SearchBar search={search} setSearch={setSearch} />
          <TouchableOpacity
            style={styles.filterButton}
            onPress={openFilterModal}
          >
            <IconSymbol name="camera.filters" size={20} color="#333" />
          </TouchableOpacity>
        </View>

        {isLoading && <ActivityIndicator size="large" />}
        {bodegasItems ? (
          <VirtualizedList
            data={bodegasItems}
            renderItem={({ item }: { item: Bodega }) => (
              <BodegaCard bodega={item} />
            )}
            keyExtractor={(item) => item.id.toString()}
            getItemCount={() => bodegasItems?.length ?? 0}
            getItem={(_, index) => bodegasItems?.[index]}
            refreshControl={
              <RefreshControl refreshing={isFetching} onRefresh={refetch} />
            }
          />
        ) : (
          <Text style={styles.noResults}>No hay bodegas disponibles</Text>
        )}
      </View>

      <FilterModal
        visible={isFilterModalVisible}
        onClose={closeFilterModal}
        title="Filtrar bodegas"
        onConfirm={handleFilterConfirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchContainer: {
    marginBottom: 20,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.white,
    width: "90%",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    maxWidth: "100%",
    fontSize: 16,
    color: "#333",
  },
  searchFiltersContainer: {
    maxWidth: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
    alignItems: "center",
    gap: 10,
  },
  filterButton: {
    padding: Spacing["1"],
  },
  noResults: {
    fontSize: 16,
    color: Colors.light.text.secondary,
    textAlign: "center",
    marginTop: Spacing.md,
  },
});
