import { NavigationHeader } from "@/components/navigation-header";
import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/spacing";
import { useSession } from "@/lib/context";
import { toTitleCase } from "@/lib/util";
import {
  EVENTO_QUERY_KEY,
  getEventoByInstanciaId,
  getEventos,
  INSTANCIA_QUERY_KEY,
} from "@/modules/evento/api";
import { EventCard } from "@/modules/evento/components/card";
import { crearReserva } from "@/modules/recorridos/api";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
const params = {
  page: 1,
  limit: 3,
};
export default function CrearRecorridoScreen() {
  const { instanciaEventoId } = useLocalSearchParams();
  const [peopleCount, setPeopleCount] = useState(1);
  const { session } = useSession();

  const { data: evento, isLoading } = useQuery({
    queryKey: [
      EVENTO_QUERY_KEY,
      INSTANCIA_QUERY_KEY,
      { id: instanciaEventoId },
    ],
    queryFn: () => getEventoByInstanciaId(Number(instanciaEventoId)),
    enabled: !!instanciaEventoId,
  });

  const { data: related } = useQuery({
    queryKey: [EVENTO_QUERY_KEY, params],
    queryFn: () => getEventos(params),
  });

  const relatedEventos = useMemo(
    () => related?.items?.filter((e) => e.id !== evento?.id).slice(0, 3),
    [related],
  );
  const handleCreateRecorrido = async () => {
    if (!session?.id || !instanciaEventoId) {
      // eslint-disable-next-line no-console
      console.error("Missing session or instanciaEventoId");
      return;
    }

    try {
      await crearReserva({
        cantidadGente: peopleCount,
        instanciaEventoId: Number(instanciaEventoId),
        // recorridoId is optional - when not provided, backend will create a new recorrido
      });

      // Navigate back or to success page
      router.back();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error creating reserva:", error);
    }
  };

  const handleContinueExploring = () => {
    // TODO: Navigate back to eventos or home

    router.back();
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <NavigationHeader title="Crear Recorrido" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      </View>
    );
  }

  if (!evento) {
    return (
      <View style={styles.container}>
        <NavigationHeader title="Crear Recorrido" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Evento no encontrado</Text>
        </View>
      </View>
    );
  }

  const totalPrice = evento.precio * peopleCount;

  return (
    <View style={styles.container}>
      <NavigationHeader title="Crear Recorrido" />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.recorridoTitle}>
          Recorrido {dayjs().format("ddd D [de] MMMM")}
        </Text>

        <View style={styles.imageContainer}>
          <Image
            source={{ uri: "https://picsum.photos/600/400" }}
            style={styles.eventImage}
            resizeMode="cover"
          />
        </View>

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

        <Text style={styles.totalPrice}>
          Total:{" "}
          <Text style={styles.totalPriceText}>
            ${totalPrice.toLocaleString()}
          </Text>
        </Text>

        <View style={styles.durationSection}>
          <Text style={styles.durationText}>1 día</Text>
        </View>

        <View style={styles.eventDetails}>
          <Text style={styles.dayTitle}>
            {toTitleCase(dayjs().format("dddd"))}
          </Text>

          <View style={styles.eventItem}>
            <Text style={styles.eventName}>{evento.nombre}</Text>
            <View style={styles.eventInfo}>
              <View style={styles.eventInfoRow}>
                <Text style={styles.eventInfoIcon}>📍</Text>
                <Text style={styles.eventInfoText}>
                  {evento.sucursal?.direccion}
                </Text>
              </View>
              <View style={styles.eventInfoRow}>
                <Text style={styles.eventInfoIcon}>🕐</Text>
                <Text style={styles.eventInfoText}>
                  {dayjs(evento.instancias?.[0]?.fecha).format("HH:mm")}
                </Text>
              </View>

              <View style={styles.eventInfoRow}>
                <Text style={styles.eventInfoText}>
                  {peopleCount} {peopleCount === 1 ? "Persona" : "Personas"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleCreateRecorrido}
          >
            <Text style={styles.primaryButtonText}>Crear recorrido</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleContinueExploring}
          >
            <Text style={styles.secondaryButtonText}>
              Seguir explorando eventos
            </Text>
          </TouchableOpacity>
        </View>
        {!!relatedEventos?.length && (
          <View style={styles.relatedSection}>
            <Text style={styles.relatedTitle}>
              Eventos que suelen elegirse junto al tuyo
            </Text>
            {relatedEventos.map((evento) => (
              <EventCard key={evento.id} evento={evento} />
            ))}
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: Colors.light.text.secondary,
  },
  recorridoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.text.primary,
    marginBottom: Spacing.lg,
    textAlign: "center",
  },
  imageContainer: {
    marginBottom: Spacing.lg,
  },
  eventImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
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
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text.primary,
    marginBottom: Spacing.md,
  },
  totalPriceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.primary,
  },
  durationSection: {
    marginBottom: Spacing.lg,
  },
  durationText: {
    fontSize: 16,
    color: Colors.light.text.secondary,
  },
  eventDetails: {
    marginBottom: Spacing.xl,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text.primary,
    marginBottom: Spacing.md,
  },
  eventItem: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: Spacing.lg,
  },
  eventName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text.primary,
    marginBottom: Spacing.sm,
  },
  eventInfo: {
    gap: Spacing.xs,
  },
  eventInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  eventInfoIcon: {
    fontSize: 14,
  },
  eventInfoText: {
    fontSize: 14,
    color: Colors.light.text.secondary,
  },
  buttonsContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  primaryButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryButtonText: {
    color: Colors.light.white,
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: Colors.light.white,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: Colors.light.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  relatedSection: {
    marginBottom: 100,
  },
  relatedTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text.primary,
    marginBottom: Spacing.md,
  },
  relatedImageContainer: {
    borderRadius: 12,
    overflow: "hidden",
  },
  relatedImage: {
    width: "100%",
    height: 120,
  },
});
