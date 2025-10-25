import { ActivityCard } from "@/components/activity-card";
import { NavigationHeader } from "@/components/navigation-header";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/colors";
import { FontWeights, Spacing } from "@/constants/spacing";
import { ApiError } from "@/lib/error";
import { InstanciaEvento } from "@/modules/evento/types";
import {
  RECORRIDOS_QUERY_KEY,
  applyOptimization,
  getOptimizedRecorrido,
} from "@/modules/recorridos/api";
import { Reserva } from "@/modules/recorridos/types";
import { calculateRecorridoData } from "@/modules/recorridos/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Toast } from "toastify-react-native";

// Set dayjs locale to Spanish
dayjs.locale("es");

// Interface for the optimized response
interface OptimizedResponse {
  originalInstances: number[];
  instancesIds: string[];
  instances: InstanciaEvento[];
}

// Function to convert optimized response to Reserva format
function convertOptimizedToReservas(
  optimizedData: OptimizedResponse,
): Reserva[] {
  return optimizedData.instances.map((instancia, index) => ({
    id: index + 1, // Generate temporary ID
    precio: instancia.evento?.precio || 0,
    cantidadGente: 1, // Default to 1 person
    instanciaEventoId: instancia.id,
    recorridoId: 0, // Will be set when applying optimization
    instanciaEvento: instancia,
  }));
}

export default function OptimizeRecorridoScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: optimizedData, isLoading } = useQuery({
    queryKey: [RECORRIDOS_QUERY_KEY, id, "optimized"],
    queryFn: () => getOptimizedRecorrido(Number(id)),
  });

  const applyOptimizationMutation = useMutation({
    mutationFn: async () => applyOptimization(Number(id)),
    onSuccess: () => {
      // Invalidate all recorrido queries to refresh the data
      queryClient.invalidateQueries({ queryKey: [RECORRIDOS_QUERY_KEY] });
      router.back();
      Toast.show({
        type: "success",
        text1: "Optimización aplicada",
        text2: "El recorrido ha sido optimizado exitosamente",
      });
    },
    onError: (error) => {
      const errorData = error as unknown as ApiError;
      Toast.show({
        type: "error",
        text1: "Error al aplicar optimización",
        text2: errorData.message || "Error al aplicar la optimización",
      });
    },
  });

  // Convert optimized data to reservas and calculate metrics
  const { dateRange, totalDays, groupedReservas, totalCost } =
    React.useMemo(() => {
      if (!optimizedData) {
        return {
          dateRange: "",
          totalDays: 0,
          groupedReservas: [],
          totalCost: 0,
        };
      }

      const reservas = convertOptimizedToReservas(optimizedData);
      return calculateRecorridoData(reservas);
    }, [optimizedData]);

  const handleApplyOptimization = async () => {
    await applyOptimizationMutation.mutateAsync();
  };

  const handleCancelOptimization = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <NavigationHeader title="Optimización" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando optimización...</Text>
        </View>
      </View>
    );
  }

  if (!optimizedData) {
    return (
      <View style={styles.container}>
        <NavigationHeader title="Optimización" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            No se pudo cargar la optimización
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <NavigationHeader title={dateRange} />

      {/* Optimized Status Header */}
      <View style={styles.optimizedHeader}>
        <View style={styles.optimizedStatusContainer}>
          <Text style={styles.optimizedStatus}>¡Optimizado!</Text>
          <IconSymbol name="sparkles" size={16} color={Colors.light.primary} />
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Editar recorrido</Text>
        </TouchableOpacity>
      </View>

      {/* Total Cost Section */}
      <View style={styles.totalSection}>
        <View style={styles.totalInfo}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>${totalCost.toLocaleString()}</Text>
        </View>
        <View style={styles.durationContainer}>
          <Text style={styles.durationText}>{totalDays} días</Text>
          <IconSymbol
            name="chevron.down"
            size={16}
            color={Colors.light.text.primary}
          />
        </View>
      </View>

      {/* Daily Activities */}
      <View style={styles.activitiesContainer}>
        {groupedReservas.map((dayGroup) => (
          <View key={dayGroup.date} style={styles.daySection}>
            <Text style={styles.dayHeader}>{dayGroup.dayName}</Text>
            {dayGroup.reservas.map((reserva) => (
              <ActivityCard
                key={reserva.id}
                reserva={reserva}
                onDelete={() => {}} // Disabled for optimized view
                onUpdatePeople={() => {}} // Disabled for optimized view
              />
            ))}
          </View>
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancelOptimization}
        >
          <Text style={styles.cancelButtonText}>Cancelar optimización</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={handleApplyOptimization}
          disabled={applyOptimizationMutation.isPending}
        >
          <Text style={styles.acceptButtonText}>
            {applyOptimizationMutation.isPending
              ? "Aplicando..."
              : "Aceptar optimización"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingBottom: Spacing["4xl"],
  },
  optimizedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray.primary,
  },
  optimizedStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  optimizedStatus: {
    fontSize: 18,
    fontWeight: FontWeights.bold,
    color: Colors.light.primary,
  },
  editButton: {
    paddingVertical: Spacing.sm,
  },
  editButtonText: {
    fontSize: 16,
    color: Colors.light.text.secondary,
    fontWeight: FontWeights.medium,
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  totalInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: FontWeights.bold,
    color: Colors.light.text.primary,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: FontWeights.bold,
    color: Colors.light.primary,
    marginLeft: Spacing.sm,
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  durationText: {
    fontSize: 16,
    fontWeight: FontWeights.medium,
    color: Colors.light.text.primary,
  },
  activitiesContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  daySection: {
    marginBottom: Spacing.lg,
  },
  dayHeader: {
    fontSize: 18,
    fontWeight: FontWeights.bold,
    color: Colors.light.text.primary,
    marginBottom: Spacing.md,
  },
  actionButtonsContainer: {
    flexDirection: "column",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing["3xl"],
    gap: Spacing.sm,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: FontWeights.medium,
    color: Colors.light.primary,
  },
  acceptButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 8,
    backgroundColor: Colors.light.primary,
    alignItems: "center",
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: FontWeights.medium,
    color: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.lg,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.light.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.lg,
  },
  errorText: {
    fontSize: 16,
    color: Colors.light.text.secondary,
  },
});
