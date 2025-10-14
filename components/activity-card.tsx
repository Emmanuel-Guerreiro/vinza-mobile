import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/spacing";
import { Reserva } from "@/modules/recorridos/types";
import dayjs from "dayjs";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ActivityCardProps {
  reserva: Reserva;
  onDelete: (id: number) => void;
  onUpdatePeople: (id: number) => void;
}

export function ActivityCard({
  reserva,
  onDelete,
  onUpdatePeople,
}: ActivityCardProps) {
  return (
    <View style={styles.activityCard}>
      <Image
        source={{
          uri:
            reserva.instanciaEvento.evento?.multimedia?.[0]?.url ??
            "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=100&h=80&fit=crop",
        }}
        style={styles.activityImage}
        resizeMode="cover"
      />
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>
          {reserva.instanciaEvento.evento?.nombre || "Evento"}
        </Text>
        <View style={styles.activityDetails}>
          <View style={styles.detailRow}>
            <IconSymbol
              name="location"
              size={12}
              color={Colors.light.text.secondary}
            />
            <Text style={styles.detailText}>
              {reserva.instanciaEvento.evento?.sucursal?.nombre || "Ubicación"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <IconSymbol
              name="clock"
              size={12}
              color={Colors.light.text.secondary}
            />
            <Text style={styles.detailText}>
              {dayjs(reserva.instanciaEvento.fecha).format("HH:mm")} Hrs
            </Text>
          </View>
          <Text style={styles.durationText}>1:30 Hrs</Text>
        </View>
      </View>
      <View style={styles.activityActions}>
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onUpdatePeople?.(reserva.id)}
          >
            <IconSymbol
              name="person.2"
              size={16}
              color={Colors.light.text.secondary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onDelete?.(reserva.id)}
          >
            <IconSymbol
              name="trash"
              size={16}
              color={Colors.light.text.secondary}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.participantsContainer}>
          <IconSymbol
            name="person"
            size={12}
            color={Colors.light.text.secondary}
          />
          <Text style={styles.participantsText}>
            {reserva.cantidadGente} Personas
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  activityCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityImage: {
    width: 60,
    height: "100%",
    borderRadius: 8,
    marginRight: Spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text.primary,
    marginBottom: Spacing.xs,
  },
  activityDetails: {
    gap: Spacing.xs,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  detailText: {
    fontSize: 14,
    color: Colors.light.text.secondary,
  },
  durationText: {
    fontSize: 14,
    color: Colors.light.text.secondary,
    marginTop: Spacing.xs,
  },
  activityActions: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    gap: Spacing.xs,
  },
  actionButton: {
    padding: Spacing.xs,
  },
  participantsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  participantsText: {
    fontSize: 12,
    color: Colors.light.text.secondary,
  },
});
