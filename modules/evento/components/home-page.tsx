import { SearchBar } from "@/components/searchbar";
import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/spacing";
import {
  ESTADO_EVENTOS_QUERY_KEY,
  EVENTO_QUERY_KEY,
  findEstadosEventos,
  getEventos,
} from "@/modules/evento/api";
import { EventCard } from "@/modules/evento/components/card";
import { EstadoEventoEnum, Evento, EventoParams } from "@/modules/evento/types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
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
import { EventoFilterFormData } from "../types";
import { EventosFilters } from "./filters";

const defaultFilters: EventoParams = {
  page: 1,
  limit: 10,
  nombre: "",
};

export function EventoHomePage() {
  const [filters, setFilters] = useState<EventoParams>(defaultFilters);

  const { data: estado } = useQuery({
    queryKey: [ESTADO_EVENTOS_QUERY_KEY, EstadoEventoEnum.ACTIVO],
    queryFn: () =>
      findEstadosEventos().then((res) => {
        return res.items.find(
          (estado) => estado.nombre === EstadoEventoEnum.ACTIVO,
        );
      }),
  });

  const { data, isLoading, isFetching, refetch } = useInfiniteQuery({
    queryKey: [
      EVENTO_QUERY_KEY,
      {
        ...defaultFilters,
        ...filters,
        estadoId: estado?.id,
      },
    ],
    queryFn: () =>
      getEventos({
        ...defaultFilters,
        ...filters,
        estadoId: estado?.id,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.meta.currentPage === lastPage.meta.totalPages
        ? undefined
        : lastPage.meta.currentPage + 1,
    initialPageParam: 1,
    enabled: !!estado,
  });

  const eventosItems = useMemo(
    () => data?.pages.flatMap((page) => page.items),
    [data?.pages?.length],
  );

  const handleFilterConfirm = (newFilters: EventoFilterFormData) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.searchFiltersContainerWrapper}>
          <View style={styles.searchFiltersContainer}>
            <SearchBar
              search={filters.nombre ?? ""}
              setSearch={(value) => setFilters({ ...filters, nombre: value })}
            />
            <EventosFilters applyFilters={handleFilterConfirm} />
          </View>
          {JSON.stringify(filters) !== JSON.stringify(defaultFilters) && (
            <TouchableOpacity onPress={() => setFilters(defaultFilters)}>
              <Text style={styles.clearFiltersButton}>Limpiar filtros</Text>
            </TouchableOpacity>
          )}
        </View>
        {isLoading && <ActivityIndicator size="large" />}
        {eventosItems ? (
          <VirtualizedList
            data={eventosItems}
            renderItem={({ item }: { item: Evento }) => (
              <EventCard evento={item} />
            )}
            keyExtractor={(item) => item.id.toString()}
            getItemCount={() => eventosItems?.length ?? 0}
            getItem={(_, index) => eventosItems?.[index]}
            refreshControl={
              <RefreshControl refreshing={isFetching} onRefresh={refetch} />
            }
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <Text style={styles.noResults}>No hay eventos disponibles</Text>
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
    paddingBottom: 80,
  },
  searchFiltersContainer: {
    maxWidth: "100%",
    flexDirection: "row",
    paddingVertical: Spacing.md,
    alignItems: "center",
    paddingRight: 10,
  },
  searchFiltersContainerWrapper: {
    paddingVertical: Spacing.md,

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  clearFiltersButton: {
    fontSize: 16,
    color: Colors.light.text.primary,
    textAlign: "center",
    marginTop: Spacing.md,
    textDecorationLine: "underline",
  },
  noResults: {
    fontSize: 16,
    color: Colors.light.text.secondary,
    textAlign: "center",
    marginTop: Spacing.md,
  },
});
