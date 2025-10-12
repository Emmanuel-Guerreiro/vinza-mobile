import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/colors";
import { formatCurrency } from "@/lib/util";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Evento } from "../types";

export function EventCard({
  evento,
  hideBodegaName,
}: {
  evento: Evento;
  hideBodegaName?: boolean;
}) {
  const router = useRouter();

  return (
    <View key={evento.id} style={styles.eventCard}>
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop",
        }}
        style={styles.eventImage}
        resizeMode="cover"
      />

      <View style={styles.eventContent}>
        {!hideBodegaName && (
          <Text style={styles.wineryName}>
            {evento.sucursal?.bodega?.nombre ?? "-"}
          </Text>
        )}
        <View style={styles.eventHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.eventTitle}>{evento.nombre}</Text>
          </View>
          <Text style={styles.eventPrice}>{formatCurrency(evento.precio)}</Text>
        </View>

        <Text style={styles.eventDescription}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Text>

        <View style={styles.eventDetails}>
          <Text style={styles.eventDetail}>
            Dirección: {evento.sucursal?.direccion}
          </Text>
          <View style={styles.dateRatingContainer}>
            <Text style={styles.eventDetail}>Fecha: 04/07/25</Text>
            <View style={styles.ratingContainer}>
              {evento.valoracionMedia?.length && (
                <>
                  <IconSymbol
                    name="star.fill"
                    size={16}
                    color={Colors.light.primary}
                  />
                  <Text style={styles.rating}>
                    {parseFloat(
                      evento.valoracionMedia[0].valor_medio.toString(),
                    ).toFixed(1)}
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.reserveButton}
          onPress={() => {
            router.push({
              pathname: "/eventos/[id]",
              params: { id: evento.id.toString() },
            });
          }}
        >
          <Text style={styles.reserveButtonText}>Reservar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  eventCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  eventImage: {
    width: "100%",
    height: 200,
  },
  eventContent: {
    padding: 20,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  wineryName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text.primary,
  },
  eventPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.primary,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.text.primary,
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: Colors.light.text.secondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  eventDetails: {
    marginBottom: 20,
  },
  eventDetail: {
    fontSize: 14,
    color: Colors.light.text.secondary,
    marginBottom: 8,
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
  dateRatingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text.secondary,
  },
});
