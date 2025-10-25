import { Colors } from "@/constants/colors";
import { appEvents } from "@/lib/app-events";
import { useInfiniteQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import React, { useEffect, useMemo } from "react";
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
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  // Escuchar eventos de actualización de nombre para revalidar data
  useEffect(() => {
    const handleRecorridoNameUpdate = () => {
      refetch();
    };

    appEvents.on("recorrido:name-updated", handleRecorridoNameUpdate);

    return () => {
      appEvents.off("recorrido:name-updated", handleRecorridoNameUpdate);
    };
  }, [refetch]);

  const recorridosItems = useMemo(() => {
    const items = data?.pages.flatMap((page) => page.items) || [];
    // Sort by status: PENDIENTE -> CONFIRMADO -> CANCELADO
    const statusOrder = {
      [EstadoRecorridoEnum.PENDIENTE]: 0,
      [EstadoRecorridoEnum.CONFIRMADO]: 1,
      [EstadoRecorridoEnum.CANCELADO]: 2,
    };

    return items.sort((a, b) => {
      // Check if any reservation has a past date (comparing only day, not time)
      const hasPastDateA =
        a.reservas?.some((reserva) =>
          dayjs(reserva?.instanciaEvento?.fecha).isBefore(dayjs(), "day"),
        ) || false;

      const hasPastDateB =
        b.reservas?.some((reserva) =>
          dayjs(reserva?.instanciaEvento?.fecha).isBefore(dayjs(), "day"),
        ) || false;

      // If one has past dates and the other doesn't, prioritize the one without past dates
      if (hasPastDateA && !hasPastDateB) return 1;
      if (!hasPastDateA && hasPastDateB) return -1;

      // If both have past dates or both don't have past dates, sort by status
      const statusA = a.estados?.[a.estados.length - 1]?.nombre;
      const statusB = b.estados?.[b.estados.length - 1]?.nombre;

      const orderA = statusA ? statusOrder[statusA] : 999;
      const orderB = statusB ? statusOrder[statusB] : 999;

      return orderA - orderB;
    });
  }, [data]);
  // console.log("recorridosItems", recorridosItems);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {isLoading && !data && <ActivityIndicator size="large" />}
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
