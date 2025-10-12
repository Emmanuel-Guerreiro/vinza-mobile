import { SearchBar } from "@/components/searchbar";
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
  View,
  VirtualizedList,
} from "react-native";
import { Bodega } from "../types";
import { BodegasFilters } from "./filters";

export function BodegaHomePage() {
  const [search, setSearch] = useState("");

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
        limit: 10,
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

  const handleFilterConfirm = () => {
    // Handle filter confirmation logic here
    // TODO: Implement filter logic
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.searchFiltersContainer}>
          <SearchBar search={search} setSearch={setSearch} />
          <BodegasFilters applyFilters={handleFilterConfirm} />
        </View>

        {isLoading && !data && <ActivityIndicator size="large" />}
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
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <Text style={styles.noResults}>No hay bodegas disponibles</Text>
        )}
      </View>
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

  noResults: {
    fontSize: 16,
    color: Colors.light.text.secondary,
    textAlign: "center",
    marginTop: Spacing.md,
  },
});
