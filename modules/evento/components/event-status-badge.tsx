import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { EstadoEventoEnum } from "../types";

interface EventStatusBadgeProps {
  estado?: EstadoEventoEnum;
}

export function EventStatusBadge({ estado }: EventStatusBadgeProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const getStatusConfig = (status?: EstadoEventoEnum) => {
    switch (status) {
      case EstadoEventoEnum.ACTIVO:
        return {
          borderColor: "#22C55E", // Green
          backgroundColor: "#DCFCE7", // Light green
          iconColor: "#22C55E",
          icon: "check-circle" as const,
          text: "Activo",
        };
      case EstadoEventoEnum.SUSPENDIDO:
        return {
          borderColor: "#F59E0B", // Yellow/Orange
          backgroundColor: "#FEF3C7", // Light yellow
          iconColor: "#F59E0B",
          icon: "pause-circle" as const,
          text: "Suspendido",
        };
      case EstadoEventoEnum.FINALIZADO:
        return {
          borderColor: "#6B7280", // Gray
          backgroundColor: "#F3F4F6", // Light gray
          iconColor: "#6B7280",
          icon: "check-circle-outline" as const,
          text: "Finalizado",
        };
      default:
        return {
          borderColor: colors.gray.primary,
          backgroundColor: colors.gray.secondary,
          iconColor: colors.gray.primary,
          icon: "help" as const,
          text: "Sin estado",
        };
    }
  };

  const config = getStatusConfig(estado);

  return (
    <View
      style={[
        styles.statusBadge,
        {
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
        },
      ]}
    >
      <MaterialIcons
        name={config.icon}
        size={16}
        color={config.iconColor}
        style={styles.icon}
      />
      <Text style={[styles.statusText, { color: config.iconColor }]}>
        {config.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  icon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
});
