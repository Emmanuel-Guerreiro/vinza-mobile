import { NavigationHeader } from "@/components/navigation-header";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/spacing";
import { BODERGA_QUERY_KEY, getBodega } from "@/modules/bodega/api";
import { EVENTO_QUERY_KEY, getEventos } from "@/modules/evento/api";
import { EventCard } from "@/modules/evento/components/card";
import { Evento } from "@/modules/evento/types";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function BodegaScreen() {
  const { id } = useLocalSearchParams();
  const { data: bodega, isLoading: bodegaLoading } = useQuery({
    queryKey: [BODERGA_QUERY_KEY, id],
    queryFn: () => getBodega(Number(id)),
  });

  const { data: eventos, isLoading: eventosLoading } = useQuery({
    queryKey: [
      EVENTO_QUERY_KEY,
      id,
      "eventos",
      {
        page: 1,
        limit: 10,
        bodegaId: Number(id),
      },
    ],
    queryFn: () =>
      getEventos({
        bodegaId: Number(id),
        page: 1,
        limit: 10,
      }),
  });

  if (bodegaLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!bodega) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Bodega no encontrada</Text>
      </View>
    );
  }

  const mainSucursal = bodega.sucursales?.find((s) => s.es_principal);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <NavigationHeader title={bodega.nombre} />
      <View style={styles.bodegaHeader}>
        <View style={styles.bodegaImageContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop",
            }}
            style={styles.bodegaImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.bodegaInfo}>
          <Text style={styles.bodegaDescription}>{bodega.descripcion}</Text>

          <View style={styles.sucursalInfo}>
            {mainSucursal && (
              <Text>Sede principal: {mainSucursal.direccion}</Text>
            )}
            <Text>Sucursales: {bodega.sucursales?.length}</Text>
            <Text>Contacto: {bodega.descripcion}</Text>
            <Text style={styles.ratingContainer}>
              Calificacion promedio: 4.5{" "}
              <IconSymbol name="star.fill" size={12} color="#FFD700" />{" "}
            </Text>
          </View>
        </View>
      </View>

      {/* Events Section */}
      <View style={styles.eventsSection}>
        <Text style={styles.eventsTitle}>Eventos disponibles</Text>
        {eventosLoading && <ActivityIndicator size="large" />}
        {!eventosLoading && (!eventos?.items || eventos.items.length === 0) && (
          <Text style={styles.noResults}>No hay eventos disponibles</Text>
        )}
        {eventos?.items?.map((evento: Evento) => (
          <EventCard hideBodegaName key={evento.id} evento={evento} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  bodegaHeader: {
    backgroundColor: Colors.light.white,
    marginBottom: Spacing.md,
    display: "flex",
    flexDirection: "column",
    gap: Spacing.md,
    paddingVertical: Spacing.md,
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
  bodegaInfo: {
    padding: Spacing.lg,
  },
  bodegaName: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.text.primary,
    marginBottom: Spacing.sm,
  },
  bodegaDescription: {
    fontSize: 16,
    color: Colors.light.text.secondary,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  sucursalInfo: {
    marginBottom: Spacing.sm,
    backgroundColor: Colors.light.gray.primary,
    padding: Spacing.md,
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    gap: Spacing.sm,
  },
  sucursalLabel: {
    marginBottom: 4,
  },
  sucursalAddress: {
    fontSize: 16,
    color: Colors.light.text.secondary,
    marginBottom: 4,
  },
  sucursalAclaraciones: {
    fontSize: 14,
    color: Colors.light.text.secondary,
    fontStyle: "italic",
  },
  branchesInfo: {
    marginBottom: Spacing.sm,
  },
  branchesLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text.primary,
  },
  eventsSection: {
    paddingHorizontal: Spacing.lg,
  },
  eventsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.text.primary,
    marginBottom: Spacing.md,
  },
  noResults: {
    fontSize: 16,
    color: Colors.light.text.secondary,
    textAlign: "center",
    marginTop: Spacing.md,
  },
  errorText: {
    fontSize: 18,
    color: Colors.light.text.secondary,
    textAlign: "center",
    marginTop: Spacing.xl,
  },
  ratingContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
});
