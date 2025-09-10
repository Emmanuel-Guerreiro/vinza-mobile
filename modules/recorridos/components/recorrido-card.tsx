import { Colors } from "@/constants/colors";
import { FontWeights, Spacing } from "@/constants/spacing";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { InstanciaEvento } from "../../evento/types";
import { Recorrido } from "../types";
import { StatusBadge } from "./status-badge";

// Set dayjs locale to Spanish
dayjs.locale("es");

interface RecorridoCardProps {
  recorrido: Recorrido;
}

interface GroupedReserva {
  date: string;
  dayName: string;
  reservas: Array<{
    id: number;
    precio: number;
    cantidadGente: number;
    instanciaEvento: InstanciaEvento;
  }>;
}

export function RecorridoCard({ recorrido }: RecorridoCardProps) {
  const router = useRouter();

  // Calculate date range and total days

  const { dateRange, totalDays, groupedReservas, totalCost } =
    React.useMemo(() => {
      if (!recorrido?.reservas || recorrido?.reservas?.length === 0) {
        return {
          dateRange: "",
          totalDays: 0,
          groupedReservas: [],
          totalCost: 0,
        };
      }

      // Get all dates from instanciaEvento
      const dates = recorrido?.reservas
        .map((reserva) => dayjs(reserva.instanciaEvento?.fecha))
        .sort((a, b) => a.valueOf() - b.valueOf());

      const startDate = dates[0];
      const endDate = dates[dates.length - 1];

      // Format date range using dayjs
      const formatDate = (date: dayjs.Dayjs, showMonth = true) => {
        return showMonth ? date.format("ddd D [de] MMM") : date.format("ddd D");
      };

      // Check if both dates are in the same month
      const sameMonth =
        startDate.month() === endDate.month() &&
        startDate.year() === endDate.year();

      const dateRange = sameMonth
        ? `${formatDate(startDate, false)} - ${formatDate(endDate, true)}`
        : `${formatDate(startDate, true)} - ${formatDate(endDate, true)}`;

      const totalDays = endDate.diff(startDate, "day") + 1;

      // Group reservas by date
      const groupedByDate = recorrido?.reservas?.reduce(
        (acc, reserva) => {
          const date = dayjs(reserva.instanciaEvento?.fecha);
          const dateKey = date.format("YYYY-MM-DD");

          if (!acc[dateKey]) {
            acc[dateKey] = {
              date: dateKey,
              dayName: formatDate(date, true),
              reservas: [],
            };
          }

          acc[dateKey].reservas.push({
            id: reserva.id,
            precio: reserva.precio,
            cantidadGente: reserva.cantidadGente,
            instanciaEvento: reserva.instanciaEvento,
          });

          return acc;
        },
        {} as Record<string, GroupedReserva>,
      );

      const allGroupedReservas = Object.values(groupedByDate).sort(
        (a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf(),
      );

      // Find the index where accumulated items reach 2
      let accumulatedItems = 0;
      let limitedIndex = 0;

      for (let i = 0; i < allGroupedReservas.length; i++) {
        accumulatedItems += allGroupedReservas[i].reservas.length;
        if (accumulatedItems >= 2) {
          limitedIndex = i + 1; // Include this group
          break;
        }
        limitedIndex = i + 1; // Include all groups if less than 2 total items
      }

      const groupedReservas = allGroupedReservas.slice(0, limitedIndex);

      const totalCost = recorrido?.reservas?.reduce(
        (sum, reserva) => sum + parseFloat(reserva.precio.toString()),
        0,
      );

      return {
        dateRange,
        totalDays,
        groupedReservas,
        totalCost,
      };
    }, [recorrido?.reservas]);

  // Get current estado
  const currentEstado = recorrido?.estados?.[0];

  // Check if should show optimization badge
  const shouldShowOptimizationBadge =
    !recorrido?.last_optimization && currentEstado?.nombre === "PENDIENTE";

  const onConfirm = () => {
    router.push({
      pathname: "/recorridos/[id]",
      params: { id: recorrido.id.toString(), confirm: "true" },
    });
  };

  return (
    <View style={styles.card}>
      {/* Optimization Badge */}
      {shouldShowOptimizationBadge && (
        <View style={styles.optimizationBadge}>
          <Text style={styles.optimizationBadgeText}>¡Posible mejora!</Text>
          <Text style={styles.optimizationBadgeIcon}>↗</Text>
        </View>
      )}
      {/* Header Images */}
      <View style={styles.headerImages}>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imageText}>🍷</Text>
        </View>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imageText}>🥂</Text>
        </View>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.moreImagesText}>+2</Text>
        </View>
      </View>

      {/* Trip Info */}
      <View style={styles.tripInfo}>
        <Text style={styles.dateRange}>{dateRange}</Text>
        <View style={styles.tripDetails}>
          <Text style={styles.totalCost}>
            Total:{" "}
            <Text style={styles.costAmount}>${totalCost.toLocaleString()}</Text>
          </Text>
          <StatusBadge currentEstado={currentEstado?.nombre} />
          <View style={styles.durationContainer}>
            <Text style={styles.duration}>
              {totalDays} {totalDays === 1 ? "día" : "días"}
            </Text>
            <Text style={styles.duration}>▼</Text>
          </View>
        </View>
      </View>

      {/* Daily Activities */}
      <ScrollView
        style={styles.activitiesContainer}
        showsVerticalScrollIndicator={false}
      >
        {groupedReservas.map((dayGroup) => (
          <View key={dayGroup.date} style={styles.daySection}>
            <Text style={styles.dayHeader}>{dayGroup.dayName}</Text>
            {dayGroup.reservas.map((reserva) => (
              <View key={reserva.id} style={styles.activityCard}>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>
                    {reserva.instanciaEvento.evento?.nombre || "Evento"}
                  </Text>
                  <View style={styles.activityDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailIcon}>📍</Text>
                      <Text style={styles.detailText}>
                        {reserva.instanciaEvento.evento?.sucursal?.nombre ||
                          "Ubicación"}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailIcon}>🕐</Text>
                      <Text style={styles.detailText}>
                        {dayjs(reserva.instanciaEvento.fecha).format("HH:mm")}{" "}
                        Hrs
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.activityMeta}>
                  <Text style={styles.activityTime}>
                    {dayjs(reserva.instanciaEvento.fecha).format("HH:mm")} Hrs
                  </Text>
                  <Text style={styles.participants}>
                    {reserva.cantidadGente}{" "}
                    {reserva.cantidadGente === 1 ? "Persona" : "Personas"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.detailButton}
          onPress={() => {
            router.push({
              pathname: "/recorridos/[id]",
              params: { id: recorrido.id.toString() },
            });
          }}
        >
          <Text style={styles.detailButtonText}>Detalle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
          <Text style={styles.confirmButtonText}>Confirmar Recorrido</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    position: "relative",
  },
  optimizationBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#8B0000", // Burgundy background
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  optimizationBadgeText: {
    color: "#FFB6C1", // Light pink text
    fontSize: 12,
    fontWeight: "500",
    marginRight: 4,
  },
  optimizationBadgeIcon: {
    color: "#FFB6C1", // Light pink icon
    fontSize: 12,
    fontWeight: "bold",
  },
  headerImages: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 8,
  },
  imagePlaceholder: {
    width: 60,
    height: 40,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  imageText: {
    fontSize: 20,
  },
  moreImagesText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
  },
  tripInfo: {
    marginBottom: 16,
  },
  dateRange: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  tripDetails: {
    flexDirection: "column",

    justifyContent: "space-between",
    alignItems: "flex-start",
    rowGap: Spacing.md,
    flexWrap: "wrap",
  },
  totalCost: {
    fontSize: 16,
    color: "#000",
  },
  costAmount: {
    marginLeft: Spacing.md,
    fontSize: 16,
    fontWeight: FontWeights.bold,
    color: "#8B0000",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusIcon: {
    fontSize: 12,
    color: "#4CAF50",
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray.primary,
    paddingBottom: Spacing.md,
    justifyContent: "space-between",
    gap: 4,
  },
  duration: {
    fontSize: 18,
    fontWeight: FontWeights.semibold,
    color: "#000",
  },
  activitiesContainer: {
    maxHeight: 300,
    marginBottom: 16,
  },
  daySection: {
    marginBottom: 12,
  },
  dayHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  activityCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 6,
  },
  activityDetails: {
    gap: 4,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  detailText: {
    fontSize: 12,
    color: "#000",
  },
  activityMeta: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  activityTime: {
    fontSize: 12,
    color: "#000",
    fontWeight: "500",
  },
  participants: {
    fontSize: 12,
    color: "#000",
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: "column",
    gap: 12,
  },
  detailButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#8B0000",
    alignItems: "center",
  },
  detailButtonText: {
    color: "#8B0000",
    fontWeight: "500",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#8B0000",
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "500",
  },
});
