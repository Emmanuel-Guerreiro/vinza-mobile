import { ActivityCard } from "@/components/activity-card";
import { NavigationHeader } from "@/components/navigation-header";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/colors";
import { FontWeights, Spacing } from "@/constants/spacing";
import { RECORRIDOS_QUERY_KEY, getRecorrido } from "@/modules/recorridos/api";
import { CancelRecorridoModal } from "@/modules/recorridos/components/cancel-recorrido-modal";
import { ConfirmRecorridoModal } from "@/modules/recorridos/components/confirm-recorrido-modal";
import { DeleteBookingModal } from "@/modules/recorridos/components/delete-booking-modal";
import { DetailHeader } from "@/modules/recorridos/components/detail-header";
import { StatusBadge } from "@/modules/recorridos/components/status-badge";
import { UpdateBookingPeopleModal } from "@/modules/recorridos/components/update-booking-people";
import { EstadoRecorridoEnum, Reserva } from "@/modules/recorridos/types";
import { calculateRecorridoData, openRoute } from "@/modules/recorridos/utils";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
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

export default function RecorridoScreen() {
  const { id, confirm } = useLocalSearchParams();
  const router = useRouter();

  const [deleteBookingModal, setDeleteBookingModal] = useState<
    Reserva["id"] | null
  >(null);
  const [updatePeopleModal, setUpdatePeopleModal] = useState<Reserva | null>(
    null,
  );
  const [cancelRecorridoModal, setCancelRecorridoModal] = useState(false);
  const [confirmRecorridoModal, setConfirmRecorridoModal] = useState(
    confirm === "true" || false,
  );
  const { data: recorrido, isLoading } = useQuery({
    queryKey: [RECORRIDOS_QUERY_KEY, id],
    queryFn: () => getRecorrido(Number(id)),
  });
  // Calculate date range and total days
  const { dateRange, totalDays, groupedReservas, totalCost } = React.useMemo(
    () => calculateRecorridoData(recorrido?.reservas || []),
    [recorrido?.reservas],
  );

  // Get current estado
  const currentEstado = recorrido?.estados?.[0];

  // Handler for updating people
  const handleUpdatePeople = (reservaId: number) => {
    const reserva = recorrido?.reservas.find((r) => r.id === reservaId);
    if (reserva) {
      setUpdatePeopleModal(reserva);
    }
  };

  const handleOptimizeRecorrido = () => {
    router.push(`/(app)/recorridos/${id}/optimize`);
  };

  const handleOpenMap = () => {
    if (!recorrido?.reservas || recorrido.reservas.length === 0) return;

    // Sort reservas by instanciaEvento date
    const sortedReservas = [...recorrido.reservas].sort((a, b) => {
      const dateA = dayjs(a.instanciaEvento?.fecha);
      const dateB = dayjs(b.instanciaEvento?.fecha);
      return dateA.valueOf() - dateB.valueOf();
    });

    // Get sucursales in chronological order and filter only contiguous duplicates
    const sucursales = sortedReservas
      .map((reserva) => reserva.instanciaEvento?.evento?.sucursal)
      .filter((sucursal) => sucursal?.latitude && sucursal?.longitude);

    // Remove only contiguous duplicates
    const filteredSucursales = sucursales.filter((sucursal, index) => {
      if (index === 0) return true; // Always keep the first one

      const previousSucursal = sucursales[index - 1];
      return !(
        sucursal?.latitude === previousSucursal?.latitude &&
        sucursal?.longitude === previousSucursal?.longitude
      );
    });

    const coords = filteredSucursales.map((sucursal) => ({
      lat: sucursal!.latitude,
      lng: sucursal!.longitude,
    }));

    if (coords.length > 0) {
      openRoute(coords);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <NavigationHeader title="Recorrido" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando recorrido...</Text>
        </View>
      </View>
    );
  }

  if (!recorrido) {
    return (
      <View style={styles.container}>
        <NavigationHeader title="Recorrido" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Recorrido no encontrado</Text>
        </View>
      </View>
    );
  }

  const addEventosToRecorrido = () => {
    router.push("/(app)/(tabs)/home?tab=eventos");
    Toast.show({
      type: "info",
      text1: "Agrega nuevos eventos",
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <DetailHeader title={dateRange} />

      {/* Edit Section */}
      <View style={styles.editSection}>
        {currentEstado?.nombre === EstadoRecorridoEnum.PENDIENTE && (
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Editar recorrido</Text>
          </TouchableOpacity>
        )}
        <View style={styles.headerRight}>
          <StatusBadge
            currentEstado={
              currentEstado?.nombre || EstadoRecorridoEnum.PENDIENTE
            }
          />
          {currentEstado?.nombre === EstadoRecorridoEnum.PENDIENTE && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={addEventosToRecorrido}
            >
              <IconSymbol name="plus" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
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
                onDelete={setDeleteBookingModal}
                onUpdatePeople={handleUpdatePeople}
              />
            ))}
          </View>
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.mapButton} onPress={handleOpenMap}>
          <IconSymbol name="map" size={16} color="white" />
          <Text style={styles.mapButtonText}>Abrir mapa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => setCancelRecorridoModal(true)}
        >
          <Text style={styles.cancelButtonText}>Cancelar recorrido</Text>
        </TouchableOpacity>
        {currentEstado?.nombre === EstadoRecorridoEnum.PENDIENTE &&
          !recorrido.last_optimization && (
            <TouchableOpacity
              style={styles.optimizeButton}
              onPress={handleOptimizeRecorrido}
            >
              <IconSymbol name="sparkles" size={16} color="white" />
              <Text style={styles.optimizeButtonText}>Optimizar</Text>
            </TouchableOpacity>
          )}
        {currentEstado?.nombre === EstadoRecorridoEnum.PENDIENTE && (
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => setConfirmRecorridoModal(true)}
          >
            <Text style={styles.confirmButtonText}>Confirmar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Delete Booking Modal */}
      {deleteBookingModal && (
        <DeleteBookingModal
          visible={!!deleteBookingModal}
          onClose={() => setDeleteBookingModal(null)}
          id={deleteBookingModal}
        />
      )}

      {/* Update People Modal */}
      {updatePeopleModal && (
        <UpdateBookingPeopleModal
          visible={!!updatePeopleModal}
          onClose={() => setUpdatePeopleModal(null)}
          reserva={updatePeopleModal}
        />
      )}

      {/* Cancel Recorrido Modal */}
      <CancelRecorridoModal
        visible={cancelRecorridoModal}
        onClose={() => setCancelRecorridoModal(false)}
        id={Number(id)}
      />

      {/* Confirm Recorrido Modal */}
      <ConfirmRecorridoModal
        visible={confirmRecorridoModal}
        onClose={() => setConfirmRecorridoModal(false)}
        id={Number(id)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingBottom: Spacing["4xl"],
  },
  editSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray.primary,
  },
  editButton: {
    paddingVertical: Spacing.sm,
  },
  editButtonText: {
    fontSize: 16,
    color: Colors.light.primary,
    fontWeight: FontWeights.medium,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
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
  mapButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 8,
    backgroundColor: Colors.light.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
  },
  mapButtonText: {
    fontSize: 16,
    fontWeight: FontWeights.medium,
    color: "white",
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
  optimizeButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 8,
    backgroundColor: Colors.light.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
  },
  optimizeButtonText: {
    fontSize: 16,
    fontWeight: FontWeights.medium,
    color: "white",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 8,
    backgroundColor: Colors.light.primary,
    alignItems: "center",
  },
  confirmButtonText: {
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
