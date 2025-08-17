import { SearchBar } from "@/components/searchbar";
import { IconSymbol } from "@/components/ui/IconSymbol";
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
  TouchableOpacity,
  View,
} from "react-native";

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

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchFiltersContainer}>
          <SearchBar search={search} setSearch={setSearch} />
          <TouchableOpacity style={styles.filterButton}>
            <IconSymbol name="camera.filters" size={20} color="#333" />
          </TouchableOpacity>
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
