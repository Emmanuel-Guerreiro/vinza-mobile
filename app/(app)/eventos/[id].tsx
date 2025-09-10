import { NavigationHeader } from "@/components/navigation-header";
import { ReservaChoiceModal } from "@/components/reserva-choice-modal";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/spacing";
import { toTitleCase } from "@/lib/util";
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

  const { data: evento } = useQuery({
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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <NavigationHeader title="Evento" />
      <View style={styles.content}>
        <Text style={styles.eventoName}>{evento?.nombre}</Text>
        <View style={styles.bodegaImageContainer}>
          <Image
            source={{ uri: "https://picsum.photos/600/600" }}
            style={styles.bodegaImage}
            resizeMode="contain"
          />
        </View>
        {/**Update to the case with the recurrencias */}
        <View style={styles.eventoInfo}>
          <Text>Tipo evento: {isRecurrente ? "Recurrente" : "Único"}</Text>
          <Text>Precio: {evento?.precio}</Text>
          <Text style={styles.ratingContainer}>
            Calificacion: 4.5{" "}
            <IconSymbol name="star.fill" size={12} color="#FFD700" />{" "}
          </Text>
          <Text>Dirección: {evento?.sucursal?.direccion}</Text>
          <Text>Estado: {toTitleCase(evento?.estado?.nombre ?? "")}</Text>
        </View>
        {!isRecurrente && (
          <TouchableOpacity
            style={styles.reserveButton}
            onPress={() => handleReservar(evento?.instancias?.[0]?.id)}
          >
            <Text style={styles.reserveButtonText}>Reservar</Text>
          </TouchableOpacity>
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
                    <TouchableOpacity
                      style={styles.instanceReserveButton}
                      onPress={() => handleReservar(item.id)}
                    >
                      <Text style={styles.instanceReserveButtonText}>
                        Reservar fecha
                      </Text>
                    </TouchableOpacity>
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
    display: "flex",
    flexDirection: "column",
    gap: Spacing.xl,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
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
    width: "95%",
    height: 200,
    borderRadius: 10,
  },
  reserveButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  reserveButtonText: {
    color: Colors.light.white,
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
    borderRadius: 12,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: "center",
  },
  instanceReserveButtonText: {
    color: Colors.light.white,
    fontSize: 12,
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
});
