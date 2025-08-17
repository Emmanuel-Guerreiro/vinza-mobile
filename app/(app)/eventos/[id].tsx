import { NavigationHeader } from "@/components/navigation-header";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/spacing";
import { EVENTO_QUERY_KEY, getEvento, getEventos } from "@/modules/evento/api";
import { EventCard } from "@/modules/evento/components/card";
import { Evento } from "@/modules/evento/types";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
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
          <Text>
            Tipo evento: {evento?.recurrencias?.length ? "Recurrente" : "Único"}
          </Text>
          <Text>Precio: {evento?.precio}</Text>
          <Text style={styles.ratingContainer}>
            Calificacion: 4.5{" "}
            <IconSymbol name="star.fill" size={12} color="#FFD700" />{" "}
          </Text>
          <Text>Dirección: {evento?.sucursal?.direccion}</Text>
        </View>
        <TouchableOpacity
          style={styles.reserveButton}
          onPress={() => {
            // eslint-disable-next-line no-console
            console.log("RESERVAR");
          }}
        >
          <Text style={styles.reserveButtonText}>Reservar</Text>
        </TouchableOpacity>
        <Text style={styles.relatedTitle}>Mas eventos de esta bodega</Text>
        <View style={styles.relatedContainer}>
          {related?.items?.map((evento: Evento) => (
            <EventCard key={evento.id} evento={evento} hideBodegaName />
          ))}
        </View>
      </View>
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
  relatedContainer: {
    display: "flex",
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: 100,
  },
});
