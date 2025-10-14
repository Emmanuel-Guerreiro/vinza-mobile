import { EventoSkeleton } from "@/components/evento-skeleton";
import { NavigationHeader } from "@/components/navigation-header";
import { ReservaChoiceModal } from "@/components/reserva-choice-modal";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/spacing";
import { EVENTO_QUERY_KEY, getEvento, getEventos } from "@/modules/evento/api";
import { EventCard } from "@/modules/evento/components/card";
import { EstadoInstanciaEventoEnum, Evento } from "@/modules/evento/types";
import { getRecorridos, RECORRIDOS_QUERY_KEY } from "@/modules/recorridos/api";
import { EstadoRecorridoEnum } from "@/modules/recorridos/types";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function EventoScreen() {
  const { id } = useLocalSearchParams();

  const [selectedInstanciaId, setSelectedInstanciaId] = useState<number | null>(
    null,
  );

  const { data: recorridos } = useQuery({
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

  const { data: evento, isLoading: isLoadingEvento } = useQuery({
    queryKey: [EVENTO_QUERY_KEY, id],
    queryFn: () => getEvento(Number(id)),
  });

  const { data: related } = useQuery({
    queryKey: [EVENTO_QUERY_KEY, "related", evento?.sucursal?.bodega?.id, id],
    queryFn: () =>
      getEventos({
        page: 1,
        limit: 10,
        bodegaId: evento?.sucursal?.bodega?.id,
      }),
    enabled: !!evento?.sucursal?.bodega?.id,
  });

  const isRecurrente = (evento?.recurrencias?.length ?? 0) > 1;
  const hasRecorridos = (recorridos?.items?.length ?? 0) > 0;

  const handleReservar = (instanciaId?: number) => {
    if (hasRecorridos) {
      if (!instanciaId) {
        return;
      }
      setSelectedInstanciaId(instanciaId);
    } else {
      // No recorridos - go directly to crear-recorrido
      const targetInstanciaId = instanciaId || Number(id);
      router.push(`/crear-recorrido?instanciaEventoId=${targetInstanciaId}`);
    }
  };

  if (isLoadingEvento) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <NavigationHeader title="Evento" />
        <EventoSkeleton />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.eventoName}>{evento?.nombre}</Text>
        <View style={styles.bodegaImageContainer}>
          <Image
            source={{
              uri:
                evento?.multimedia?.[0]?.url ??
                "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop",
            }}
            style={styles.bodegaImage}
            resizeMode="contain"
          />
        </View>
        {/**Update to the case with the recurrencias */}
        <View style={styles.eventoInfo}>
          <Text>Tipo evento: {isRecurrente ? "Recurrente" : "Único"}</Text>
          <Text>Precio: {evento?.precio}</Text>
          <Text style={styles.ratingContainer}>
            Calificacion: {evento?.valoracionMedia?.[0]?.valor_medio}
            <IconSymbol name="star.fill" size={12} color="#FFD700" />{" "}
          </Text>
          <Text>Dirección: {evento?.sucursal?.direccion}</Text>
          {/* <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>Estado:</Text>
            <EventStatusBadge
              estado={evento?.estado?.nombre as EstadoEventoEnum}
            />
          </View> */}
        </View>
        {!isRecurrente && (
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.reserveButton}
              onPress={() => handleReservar(evento?.instancias?.[0]?.id)}
            >
              <Text style={styles.reserveButtonText}>Reservar</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={styles.puntuarButton}
              onPress={() =>
                router.push(`/puntuar/${evento?.instancias?.[0]?.id}`)
              }
            >
              <Text style={styles.puntuarButtonText}>Puntuar</Text>
            </TouchableOpacity> */}
          </View>
        )}
        {isRecurrente && (
          <>
            <Text style={styles.datesTitle}>Fechas para este evento</Text>
            <View style={{ flexDirection: "column", gap: Spacing.xs }}>
              {evento?.instancias
                ?.filter(
                  (instancia) =>
                    instancia.estado.nombre ===
                    EstadoInstanciaEventoEnum.ACTIVA,
                )
                ?.map((item) => (
                  <View key={item.id} style={styles.instanceCard}>
                    <View style={{ flexDirection: "column", gap: Spacing.xs }}>
                      <Text>Fecha</Text>
                      <Text>
                        {dayjs(item.fecha).format("DD/MM/YYYY HH:mm")}
                      </Text>
                    </View>
                    <View style={styles.instanceButtonsContainer}>
                      <TouchableOpacity
                        style={styles.instanceReserveButton}
                        onPress={() => handleReservar(item.id)}
                      >
                        <Text style={styles.instanceReserveButtonText}>
                          Reservar fecha
                        </Text>
                      </TouchableOpacity>
                      {/* <TouchableOpacity
                        style={styles.instancePuntuarButton}
                        onPress={() => router.push(`/puntuar/${item.id}`)}
                      >
                        <Text style={styles.instancePuntuarButtonText}>
                          Puntuar
                        </Text>
                      </TouchableOpacity> */}
                    </View>
                  </View>
                ))}
            </View>
          </>
        )}
        <Text style={styles.relatedTitle}>Mas eventos de esta bodega</Text>
        <View style={styles.relatedContainer}>
          {related?.items?.map((evento: Evento) => (
            <EventCard key={evento.id} evento={evento} hideBodegaName />
          ))}
        </View>
      </View>
      {!!selectedInstanciaId && (
        <ReservaChoiceModal
          visible={selectedInstanciaId !== null}
          onClose={() => setSelectedInstanciaId(null)}
          instanciaEventoId={selectedInstanciaId || 0}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: Spacing.xl,
  },
  content: {
    paddingTop: 75,
    display: "flex",
    flexDirection: "column",
    gap: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  eventoName: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.text.primary,
    marginBottom: Spacing.sm,
  },
  eventoInfo: {
    marginBottom: Spacing.sm,
    backgroundColor: Colors.light.gray.primary,
    padding: Spacing.md,
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    gap: Spacing.sm,
  },
  ratingContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  bodegaImageContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  bodegaImage: {
    width: "100%",
    height: "auto",
    aspectRatio: 16 / 9,
    objectFit: "cover",
    borderRadius: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  reserveButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    flex: 1,
  },
  reserveButtonText: {
    color: Colors.light.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  puntuarButton: {
    backgroundColor: Colors.light.white,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    flex: 1,
  },
  puntuarButtonText: {
    color: Colors.light.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
  relatedTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text.primary,
  },
  datesTitle: {
    fontSize: 16,
    fontWeight: "medium",
    textAlign: "center",
    marginHorizontal: "auto",
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.primary,
    paddingBottom: Spacing.sm,
    color: Colors.light.text.primary,
    marginBottom: Spacing.sm,
  },
  instanceReserveButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: "center",
  },
  instanceReserveButtonText: {
    color: Colors.light.white,
    fontSize: 12,
  },
  instancePuntuarButton: {
    backgroundColor: Colors.light.white,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: "center",
  },
  instancePuntuarButtonText: {
    color: Colors.light.primary,
    fontSize: 12,
  },
  instanceButtonsContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  instanceCard: {
    backgroundColor: Colors.light.gray.primary,
    padding: Spacing.md,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  relatedContainer: {
    display: "flex",
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: 100,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  statusLabel: {
    fontSize: 14,
    color: Colors.light.text.secondary,
  },
});
