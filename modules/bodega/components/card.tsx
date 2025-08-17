import { Colors } from "@/constants/colors";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Bodega } from "../types";

export function BodegaCard({ bodega }: { bodega: Bodega }) {
  const router = useRouter();
  return (
    <View key={bodega.id} style={styles.eventCard}>
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop",
        }}
        style={styles.eventImage}
        resizeMode="cover"
      />

      <View style={styles.eventContent}>
        <Text style={styles.wineryName}>{bodega.nombre}</Text>
        <Text style={styles.eventDescription}>{bodega.descripcion}</Text>
        <TouchableOpacity
          style={styles.reserveButton}
          onPress={() => {
            router.push(`/bodegas/${bodega.id}`);
          }}
        >
          <Text style={styles.reserveButtonText}>Ver eventos</Text>
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
  wineryName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  eventDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 20,
  },
  reserveButton: {
    backgroundColor: Colors.light.white,
    borderColor: Colors.light.gray.primary,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  reserveButtonText: {
    color: Colors.light.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
});
