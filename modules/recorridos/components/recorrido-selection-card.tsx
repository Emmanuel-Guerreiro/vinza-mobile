import { Colors } from "@/constants/colors";
import { FontWeights, Spacing } from "@/constants/spacing";
import dayjs from "dayjs";
import "dayjs/locale/es";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Recorrido } from "../types";
import { calculateRecorridoDataWithLimit } from "../utils";

// Set dayjs locale to Spanish
dayjs.locale("es");

interface RecorridoSelectionCardProps {
  recorrido: Recorrido;
  onSelect: (recorridoId: number) => void;
}

export function RecorridoSelectionCard({
  recorrido,
  onSelect,
}: RecorridoSelectionCardProps) {
  // Calculate date range and total days
  const { dateRange, totalDays, groupedReservas, totalCost } = React.useMemo(
    () => calculateRecorridoDataWithLimit(recorrido?.reservas || [], 2),
    [recorrido?.reservas],
  );

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onSelect(recorrido.id)}
    >
      {/* Header Images */}
      <View style={styles.headerImages}>
        {groupedReservas.slice(0, 3).map((dayGroup, index) => (
          <View key={dayGroup.date} style={styles.imageContainer}>
            <Image
              source={{ uri: "https://picsum.photos/200/150" }}
              style={styles.headerImage}
              resizeMode="cover"
            />
            {index === 2 && groupedReservas.length > 3 && (
              <View style={styles.moreImagesOverlay}>
                <Text style={styles.moreImagesText}>
                  +{groupedReservas.length - 3}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Date Range */}
      <Text style={styles.dateRange}>{dateRange}</Text>

      {/* Total Cost and Duration */}
      <View style={styles.totalSection}>
        <View style={styles.totalInfo}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>${totalCost.toLocaleString()}</Text>
        </View>
        <View style={styles.durationContainer}>
          <Text style={styles.durationText}>{totalDays} días</Text>
        </View>
      </View>

      {/* Daily Activities */}
      <View style={styles.activitiesContainer}>
        {groupedReservas.map((dayGroup) => (
          <View key={dayGroup.date} style={styles.daySection}>
            <Text style={styles.dayHeader}>{dayGroup.dayName}</Text>
            {dayGroup.reservas.map((reserva) => (
              <View key={reserva.id} style={styles.activityItem}>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityName}>
                    {reserva.instanciaEvento?.evento?.nombre || "Evento"}
                  </Text>
                  <View style={styles.activityDetails}>
                    <View style={styles.activityDetailRow}>
                      <Text style={styles.activityDetailIcon}>📍</Text>
                      <Text style={styles.activityDetailText}>
                        {reserva.instanciaEvento?.evento?.sucursal?.direccion ||
                          "Ubicación"}
                      </Text>
                    </View>
                    <View style={styles.activityDetailRow}>
                      <Text style={styles.activityDetailIcon}>🕐</Text>
                      <Text style={styles.activityDetailText}>
                        {dayjs(reserva.instanciaEvento?.fecha).format("HH:mm")}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.activityMeta}>
                  <Text style={styles.activityTime}>
                    {dayjs(reserva.instanciaEvento?.fecha).format("HH:mm")}
                  </Text>
                  <Text style={styles.activityPeople}>
                    {reserva.cantidadGente}{" "}
                    {reserva.cantidadGente === 1 ? "Persona" : "Personas"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Add Event Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => onSelect(recorrido.id)}
      >
        <Text style={styles.addButtonText}>
          Agregar evento a este recorrido
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.white,
    borderRadius: 16,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerImages: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  imageContainer: {
    position: "relative",
    flex: 1,
  },
  headerImage: {
    width: "100%",
    height: 80,
    borderRadius: 8,
  },
  moreImagesOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  moreImagesText: {
    color: Colors.light.white,
    fontSize: 16,
    fontWeight: FontWeights.bold,
  },
  dateRange: {
    fontSize: 18,
    fontWeight: FontWeights.bold,
    color: Colors.light.text.primary,
    marginBottom: Spacing.md,
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  totalInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: FontWeights.bold,
    color: Colors.light.text.primary,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: FontWeights.bold,
    color: Colors.light.primary,
    marginLeft: Spacing.sm,
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  durationText: {
    fontSize: 14,
    fontWeight: FontWeights.medium,
    color: Colors.light.text.primary,
  },
  activitiesContainer: {
    marginBottom: Spacing.lg,
  },
  daySection: {
    marginBottom: Spacing.md,
  },
  dayHeader: {
    fontSize: 16,
    fontWeight: FontWeights.bold,
    color: Colors.light.text.primary,
    marginBottom: Spacing.sm,
  },
  activityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: Spacing.sm,
  },
  activityInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  activityName: {
    fontSize: 14,
    fontWeight: FontWeights.medium,
    color: Colors.light.text.primary,
    marginBottom: Spacing.xs,
  },
  activityDetails: {
    gap: Spacing.xs,
  },
  activityDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  activityDetailIcon: {
    fontSize: 12,
  },
  activityDetailText: {
    fontSize: 12,
    color: Colors.light.text.secondary,
  },
  activityMeta: {
    alignItems: "flex-end",
  },
  activityTime: {
    fontSize: 12,
    fontWeight: FontWeights.medium,
    color: Colors.light.text.primary,
    marginBottom: Spacing.xs,
  },
  activityPeople: {
    fontSize: 12,
    color: Colors.light.text.secondary,
  },
  addButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
  },
  addButtonText: {
    color: Colors.light.white,
    fontSize: 16,
    fontWeight: FontWeights.medium,
  },
});
