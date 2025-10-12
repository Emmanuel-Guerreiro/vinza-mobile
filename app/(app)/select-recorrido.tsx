import { NavigationHeader } from "@/components/navigation-header";
import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/spacing";
import { useSession } from "@/lib/context";
import { ApiError } from "@/lib/error";
import {
  crearReserva,
  getRecorridos,
  RECORRIDOS_QUERY_KEY,
} from "@/modules/recorridos/api";
import { RecorridoSelectionCard } from "@/modules/recorridos/components/recorrido-selection-card";
import { EstadoRecorridoEnum, Recorrido } from "@/modules/recorridos/types";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Toast } from "toastify-react-native";

export default function SelectRecorridoScreen() {
  const { instanciaEventoId } = useLocalSearchParams();
  const { session } = useSession();
  const [peopleCount, setPeopleCount] = useState(1);

  const { data: recorridos, isLoading } = useQuery({
    queryKey: [
      RECORRIDOS_QUERY_KEY,
      { page: 1, limit: 1e9, estados: EstadoRecorridoEnum.PENDIENTE },
    ],
    queryFn: () =>
      getRecorridos({
        page: 1,
        limit: 1e9,
        estados: EstadoRecorridoEnum.PENDIENTE,
      }),
  });

  const handleSelectRecorrido = async (recorridoId: number) => {
    if (!session?.id || !instanciaEventoId) {
      console.error("Missing session or instanciaEventoId");
      return;
    }

    try {
      await crearReserva({
        cantidadGente: peopleCount,
        instanciaEventoId: Number(instanciaEventoId),
        recorridoId: recorridoId,
      });

      // Navigate back or to success page
      Toast.show({
        type: "info",
        text1: "Evento agregado al recorrido",
      });
      router.back();
    } catch (error) {
      const errorData = error as unknown as ApiError;
      Toast.show({
        type: "error",
        text1: "Error al agregar evento al recorrido",
        text2: errorData.message,
      });
      console.error("Error adding evento to recorrido:", error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <NavigationHeader title="Seleccionar Recorrido" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NavigationHeader title="Seleccionar Recorrido" />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          Selecciona el recorrido al que quieres agregar este evento
        </Text>

        <View style={styles.peopleSection}>
          <Text style={styles.peopleLabel}>Cantidad de personas</Text>
          <View style={styles.peopleSelector}>
            <TouchableOpacity
              style={styles.peopleButton}
              onPress={() => setPeopleCount(Math.max(1, peopleCount - 1))}
            >
              <Text style={styles.peopleButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.peopleCount}>{peopleCount}</Text>
            <TouchableOpacity
              style={styles.peopleButton}
              onPress={() => setPeopleCount(peopleCount + 1)}
            >
              <Text style={styles.peopleButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {recorridos?.items && recorridos.items.length > 0 ? (
          <View style={styles.recorridosList}>
            {recorridos.items.map((recorrido: Recorrido) => (
              <RecorridoSelectionCard
                key={recorrido.id}
                recorrido={recorrido}
                onSelect={handleSelectRecorrido}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No tienes recorridos disponibles
            </Text>
          </View>
        )}
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
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.text.secondary,
    textAlign: "center",
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  recorridosList: {
    gap: Spacing.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing["2xl"],
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.light.text.secondary,
    textAlign: "center",
  },
  peopleSection: {
    marginBottom: Spacing.lg,
  },
  peopleLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text.primary,
    marginBottom: Spacing.sm,
  },
  peopleSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.lg,
  },
  peopleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.gray.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  peopleButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.text.primary,
  },
  peopleCount: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text.primary,
    minWidth: 30,
    textAlign: "center",
  },
});
