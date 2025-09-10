import { Colors } from "@/constants/colors";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  VirtualizedList,
} from "react-native";
import { getRecorridos, RECORRIDOS_QUERY_KEY } from "../api";
import { EstadoRecorridoEnum, Recorrido } from "../types";
import { RecorridoCard } from "./recorrido-card";

const defaultParams = {
  page: 1,
  limit: 10,
};

export function RecorridosHomePage() {
  const { data, isLoading, isFetching, refetch } = useInfiniteQuery({
    queryKey: [RECORRIDOS_QUERY_KEY, { ...defaultParams }],
    queryFn: () => getRecorridos({ ...defaultParams }),
    getNextPageParam: (lastPage) =>
      lastPage?.meta?.currentPage === lastPage?.meta?.totalPages
        ? undefined
        : lastPage.meta.currentPage + 1,
    initialPageParam: 1,
  });

  const recorridosItems = useMemo(() => {
    const items = data?.pages.flatMap((page) => page.items) || [];

    // Sort by status: PENDIENTE -> CONFIRMADO -> CANCELADO
    const statusOrder = {
      [EstadoRecorridoEnum.PENDIENTE]: 0,
      [EstadoRecorridoEnum.CONFIRMADO]: 1,
      [EstadoRecorridoEnum.CANCELADO]: 2,
    };

    return items.sort((a, b) => {
      // Get the current status (assuming the last status in the array is the current one)
      const statusA = a.estados?.[a.estados.length - 1]?.nombre;
      const statusB = b.estados?.[b.estados.length - 1]?.nombre;

      const orderA = statusA ? statusOrder[statusA] : 999;
      const orderB = statusB ? statusOrder[statusB] : 999;

      return orderA - orderB;
    });
  }, [data?.pages?.length]);
  // console.log("recorridosItems", recorridosItems);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {isLoading && <ActivityIndicator size="large" />}
        {recorridosItems?.length ? (
          <VirtualizedList
            data={recorridosItems ?? []}
            renderItem={({ item }: { item: Recorrido }) => (
              <RecorridoCard recorrido={item} />
            )}
            keyExtractor={(item) => item?.id?.toString()}
            getItemCount={() => recorridosItems?.length ?? 0}
            getItem={(_, index) => recorridosItems?.[index]}
            refreshControl={
              <RefreshControl refreshing={isFetching} onRefresh={refetch} />
            }
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <Text style={styles.noResults}>No hay recorridos disponibles</Text>
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
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.text.primary,
    marginVertical: 16,
  },
  noResults: {
    fontSize: 16,
    color: Colors.light.text.secondary,
    textAlign: "center",
    marginTop: 50,
  },
});
