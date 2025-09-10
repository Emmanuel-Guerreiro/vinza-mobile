import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { EstadoRecorridoEnum } from "../types";

interface StatusBadgeProps {
  currentEstado: EstadoRecorridoEnum;
}

export function StatusBadge({ currentEstado }: StatusBadgeProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const getStatusConfig = (status: EstadoRecorridoEnum) => {
    switch (status) {
      case EstadoRecorridoEnum.CONFIRMADO:
        return {
          borderColor: "#22C55E", // Green
          backgroundColor: "#DCFCE7", // Light green
          iconColor: "#22C55E",
          icon: "check" as const,
          text: "Confirmado",
        };
      case EstadoRecorridoEnum.PENDIENTE:
        return {
          borderColor: "#F59E0B", // Yellow/Orange
          backgroundColor: "#FEF3C7", // Light yellow
          iconColor: "#F59E0B",
          icon: "refresh" as const,
          text: "Pendiente",
        };
      case EstadoRecorridoEnum.CANCELADO:
        return {
          borderColor: "#EF4444", // Red
          backgroundColor: "#FEE2E2", // Light red
          iconColor: "#EF4444",
          icon: "close" as const,
          text: "Cancelado",
        };
      default:
        return {
          borderColor: colors.gray.primary,
          backgroundColor: colors.gray.secondary,
          iconColor: colors.gray.primary,
          icon: "help" as const,
          text: "Desconocido",
        };
    }
  };

  const config = getStatusConfig(currentEstado);

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
