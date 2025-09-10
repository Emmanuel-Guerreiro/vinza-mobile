import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/spacing";
import {
  EVENTO_QUERY_KEY,
  getEventoByInstanciaId,
  INSTANCIA_QUERY_KEY,
  puntuarEvento,
} from "@/modules/evento/api";
import { PuntuarHeader } from "@/modules/evento/components/puntuar-header";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PuntuarEventoScreen() {
  const { id } = useLocalSearchParams();
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const queryClient = useQueryClient();

  const { data: evento, isLoading } = useQuery({
    queryKey: [EVENTO_QUERY_KEY, INSTANCIA_QUERY_KEY, { id }],
    queryFn: () => getEventoByInstanciaId(Number(id)),
    enabled: !!id,
  });

  const puntuarMutation = useMutation({
    mutationFn: puntuarEvento,
    onSuccess: () => {
      // Revalidate eventos query
      queryClient.invalidateQueries({ queryKey: [EVENTO_QUERY_KEY] });
      // Navigate to home
      router.push("/(app)/(tabs)/home");
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error("Error al puntuar:", error);
    },
  });

  const handlePuntuar = () => {
    if (selectedRating === 0 || !evento) return;

    puntuarMutation.mutate({
      valor: selectedRating,
      eventoId: evento.id,
    });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <PuntuarHeader title="Puntuar evento" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      </View>
    );
  }

  if (!evento) {
    return (
      <View style={styles.container}>
        <PuntuarHeader title="Puntuar evento" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Evento no encontrado</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <PuntuarHeader title="Puntuar evento" />
      <View style={styles.content}>
        <Text style={styles.eventoName}>{evento.nombre}</Text>

        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{evento.descripcion}</Text>
        </View>

        <View style={styles.eventoInfo}>
          <Text style={styles.infoText}>
            Precio:{" "}
            <Text style={styles.boldText}>
              ${evento.precio.toLocaleString()}
            </Text>
          </Text>
          <Text style={styles.infoText}>
            Dirección:{" "}
            <Text style={styles.boldText}>{evento.sucursal?.direccion}</Text>
          </Text>
          <Text style={styles.infoText}>
            Fecha:{" "}
            <Text style={styles.boldText}>
              {dayjs(evento.instancias?.[0]?.fecha).format("DD/MM/YYYY")}
            </Text>
          </Text>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={{ uri: "https://picsum.photos/600/400" }}
            style={styles.eventImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.ratingContainer}>
          <Text style={styles.ratingTitle}>Califica este evento</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setSelectedRating(star)}
                style={styles.starButton}
              >
                <IconSymbol
                  name="star.fill"
                  size={32}
                  color={star <= selectedRating ? "#FFD700" : "#E0E0E0"}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.puntuarButton}
          onPress={handlePuntuar}
          disabled={selectedRating === 0 || puntuarMutation.isPending}
        >
          {puntuarMutation.isPending ? (
            <ActivityIndicator color={Colors.light.white} />
          ) : (
            <Text style={styles.puntuarButtonText}>Puntuar este evento</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    gap: Spacing.lg,
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
  eventoName: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.text.primary,
  },
  descriptionContainer: {
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: 14,
    color: Colors.light.text.secondary,
    lineHeight: 20,
  },
  eventoInfo: {
    backgroundColor: Colors.light.gray.primary,
    padding: Spacing.md,
    borderRadius: 10,
    gap: Spacing.sm,
  },
  infoText: {
    fontSize: 14,
    color: Colors.light.text.primary,
  },
  boldText: {
    fontWeight: "bold",
  },
  imageContainer: {
    alignItems: "center",
  },
  eventImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  ratingContainer: {
    alignItems: "center",
    gap: Spacing.md,
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text.primary,
  },
  starsContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  starButton: {
    padding: Spacing.xs,
  },
  puntuarButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 100,
  },

  puntuarButtonText: {
    color: Colors.light.white,

    fontSize: 16,
    fontWeight: "600",
  },
});
