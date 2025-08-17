import { SearchBar } from "@/components/searchbar";
import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/spacing";
import { EVENTO_QUERY_KEY, getEventos } from "@/modules/evento/api";
import { EventCard } from "@/modules/evento/components/card";
import { Evento } from "@/modules/evento/types";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { EventosFilters } from "./filters";

export function EventoHomePage() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: [
      EVENTO_QUERY_KEY,
      {
        page: 1,
        limit: 10,
        nombre: search,
      },
    ],
    queryFn: () =>
      getEventos({
        page: 1,
        limit: 10,
        nombre: search,
      }),
  });

  const handleFilterConfirm = () => {
    // Handle filter confirmation logic here
    // TODO: Implement filter logic
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchFiltersContainer}>
          <SearchBar search={search} setSearch={setSearch} />
          <EventosFilters applyFilters={handleFilterConfirm} />
        </View>
        {isLoading && <ActivityIndicator size="large" />}
        {!isLoading && data?.items?.length === 0 && (
          <Text style={styles.noResults}>No hay eventos disponibles</Text>
        )}
        {data?.items?.map((evento: Evento) => (
          <EventCard key={evento.id} evento={evento} />
        ))}
      </ScrollView>
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
