import { FilterModal } from "@/components/filters-modal";
import { FilterConfirmButton } from "@/components/filters-modal/filter-confirm-button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { BODERGA_QUERY_KEY, getBodegas } from "@/modules/bodega/api";
import { Bodega } from "@/modules/bodega/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CATEGORIA_EVENTOS_QUERY_KEY, findCategoriasEventos } from "../api";
import { EventoFilterSchema } from "../schemas";
import { CategoriaEvento, EventoFilterFormData } from "../types";

interface EventosFiltersProps {
  applyFilters: (filters: EventoFilterFormData) => void;
}

export function EventosFilters({ applyFilters }: EventosFiltersProps) {
  const [showPuntuacionPicker, setShowPuntuacionPicker] = useState(false);
  const [showCategoriaPicker, setShowCategoriaPicker] = useState(false);
  const [showBodegaPicker, setShowBodegaPicker] = useState(false);
  const [categoriaSearch, setCategoriaSearch] = useState("");
  const [bodegaSearch, setBodegaSearch] = useState("");

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventoFilterFormData>({
    resolver: zodResolver(EventoFilterSchema),
    defaultValues: {
      puntuacionMinima: undefined,
      categoriaId: undefined,
      precioMinimo: undefined,
      precioMaximo: undefined,
      bodegaId: undefined,
    },
  });

  const { data: categoriasResponse } = useQuery({
    queryKey: [CATEGORIA_EVENTOS_QUERY_KEY],
    queryFn: findCategoriasEventos,
  });

  const { data: bodegas } = useQuery({
    queryKey: [BODERGA_QUERY_KEY, { page: 1, limit: 100 }],
    queryFn: () => getBodegas({ page: 1, limit: 100 }),
  });

  const categorias = categoriasResponse?.items;
  const watchedValues = watch();

  // Filter and limit categorias
  const filteredCategorias = categorias
    ?.filter((categoria) =>
      categoria.nombre.toLowerCase().includes(categoriaSearch.toLowerCase()),
    )
    .slice(0, 4);

  // Filter and limit bodegas
  const filteredBodegas = bodegas?.items
    ?.filter((bodega) =>
      bodega.nombre.toLowerCase().includes(bodegaSearch.toLowerCase()),
    )
    .slice(0, 4);

  const onSubmit = (data: EventoFilterFormData) => {
    setShowCategoriaPicker(false);
    setShowBodegaPicker(false);
    setShowPuntuacionPicker(false);
    applyFilters(data);
  };

  const getPuntuacionText = (value: number | undefined) => {
    if (!value) return "Seleccionar puntuación";
    return `${value} ${value === 1 ? "Estrella" : "Estrellas"}`;
  };

  const getCategoriaText = (categoriaId: number | undefined) => {
    if (!categoriaId || categoriaId === -1) return "Seleccionar categoría";
    const categoria = categorias?.find((c) => c.id === categoriaId);
    return categoria?.nombre || "Categoría no encontrada";
  };

  const getBodegaText = (bodegaId: number | undefined) => {
    if (!bodegaId || bodegaId === -1) return "Seleccionar bodega";
    const bodega = bodegas?.items?.find((b) => b.id === bodegaId);
    return bodega?.nombre || "Bodega no encontrada";
  };

  const handleCategoriaPickerOpen = () => {
    setShowCategoriaPicker(!showCategoriaPicker);
    setShowPuntuacionPicker(false);
    setShowBodegaPicker(false);
    setCategoriaSearch(""); // Reset search when opening
  };

  const handleBodegaPickerOpen = () => {
    setShowBodegaPicker(!showBodegaPicker);
    setShowPuntuacionPicker(false);
    setShowCategoriaPicker(false);
    setBodegaSearch(""); // Reset search when opening
  };

  const renderPuntuacionItem = ({ item }: { item: number | "none" }) => (
    <TouchableOpacity
      style={styles.pickerOption}
      onPress={() => {
        setValue("puntuacionMinima", item === "none" ? undefined : item);
        setShowPuntuacionPicker(false);
      }}
    >
      <Text style={styles.pickerOptionText}>
        {item === "none"
          ? "Sin mínimo"
          : `${item} ${item === 1 ? "Estrella" : "Estrellas"}`}
      </Text>
    </TouchableOpacity>
  );

  const renderCategoriaItem = ({ item }: { item: CategoriaEvento }) => {
    if (item.id === -1) {
      return (
        <TouchableOpacity
          style={styles.pickerOption}
          onPress={() => {
            setValue("categoriaId", undefined);
            setShowCategoriaPicker(false);
          }}
        >
          <Text style={styles.pickerOptionText}>Todas las categorías</Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        style={styles.pickerOption}
        onPress={() => {
          setValue("categoriaId", item.id);
          setShowCategoriaPicker(false);
        }}
      >
        <Text style={styles.pickerOptionText}>{item.nombre}</Text>
      </TouchableOpacity>
    );
  };

  const renderBodegaItem = ({ item }: { item: Bodega }) => {
    if (item.id === -1) {
      return (
        <TouchableOpacity
          style={styles.pickerOption}
          onPress={() => {
            setValue("bodegaId", undefined);
            setShowBodegaPicker(false);
          }}
        >
          <Text style={styles.pickerOptionText}>Todas las bodegas</Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        style={styles.pickerOption}
        onPress={() => {
          setValue("bodegaId", item.id);
          setShowBodegaPicker(false);
        }}
      >
        <Text style={styles.pickerOptionText}>{item.nombre}</Text>
      </TouchableOpacity>
    );
  };

  const puntuacionData: (number | "none")[] = ["none", 1, 2, 3, 4, 5];

  return (
    <FilterModal>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Filtrar eventos</Text>
      </View>

      {/* Puntuación mínima */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Puntuación mínima</Text>
        <TouchableOpacity
          style={styles.filterInput}
          onPress={() => {
            setShowPuntuacionPicker(!showPuntuacionPicker);
            setShowCategoriaPicker(false);
            setShowBodegaPicker(false);
          }}
        >
          <Text style={styles.filterInputText}>
            {getPuntuacionText(watchedValues.puntuacionMinima)}
          </Text>
          <IconSymbol name="chevron.down" size={16} color="#666" />
        </TouchableOpacity>
        {showPuntuacionPicker && (
          <View style={styles.pickerContainer}>
            <FlatList
              data={puntuacionData}
              renderItem={renderPuntuacionItem}
              keyExtractor={(item) =>
                item === "none" ? "none" : item.toString()
              }
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </View>

      {/* Categoría de evento */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Categoría de evento</Text>
        <TouchableOpacity
          style={styles.filterInput}
          onPress={handleCategoriaPickerOpen}
        >
          <Text style={styles.filterInputText}>
            {getCategoriaText(watchedValues.categoriaId)}
          </Text>
          <IconSymbol name="chevron.down" size={16} color="#666" />
        </TouchableOpacity>
        {showCategoriaPicker && (
          <View style={styles.pickerContainer}>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar categoría..."
                value={categoriaSearch}
                onChangeText={setCategoriaSearch}
                placeholderTextColor="#999"
              />
            </View>

            <FlatList
              data={
                filteredCategorias
                  ? [
                      {
                        id: -1,
                        nombre: "Todas las categorías",
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        deleted_at: null,
                      },
                      ...filteredCategorias,
                    ]
                  : []
              }
              renderItem={renderCategoriaItem}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <Text style={styles.noResultsText}>
                  No se encontraron categorías
                </Text>
              }
            />
          </View>
        )}
      </View>

      {/* Rango de precio */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Rango de precio</Text>
        <View style={styles.priceRangeContainer}>
          <View style={styles.priceInputContainer}>
            <Text style={styles.priceLabel}>Mínimo</Text>
            <Controller
              control={control}
              name="precioMinimo"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[
                    styles.priceInput,
                    errors.precioMinimo && styles.inputError,
                  ]}
                  placeholder="0"
                  value={value?.toString() || ""}
                  onChangeText={(text) =>
                    onChange(text ? Number(text) : undefined)
                  }
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
              )}
            />
          </View>
          <View style={styles.priceInputContainer}>
            <Text style={styles.priceLabel}>Máximo</Text>
            <Controller
              control={control}
              name="precioMaximo"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[
                    styles.priceInput,
                    errors.precioMaximo && styles.inputError,
                  ]}
                  placeholder="1000"
                  value={value?.toString() || ""}
                  onChangeText={(text) =>
                    onChange(text ? Number(text) : undefined)
                  }
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
              )}
            />
          </View>
        </View>
        {(errors.precioMinimo || errors.precioMaximo) && (
          <Text style={styles.errorText}>
            {errors.precioMinimo?.message || errors.precioMaximo?.message}
          </Text>
        )}
      </View>

      {/* Bodega */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Bodega</Text>
        <TouchableOpacity
          style={styles.filterInput}
          onPress={handleBodegaPickerOpen}
        >
          <Text style={styles.filterInputText}>
            {getBodegaText(watchedValues.bodegaId)}
          </Text>
          <IconSymbol name="chevron.down" size={16} color="#666" />
        </TouchableOpacity>
        {showBodegaPicker && (
          <View style={styles.pickerContainer}>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar bodega..."
                value={bodegaSearch}
                onChangeText={setBodegaSearch}
                placeholderTextColor="#999"
              />
            </View>

            <FlatList
              data={
                filteredBodegas
                  ? [
                      { id: -1, nombre: "Todas las bodegas", descripcion: "" },
                      ...filteredBodegas,
                    ]
                  : []
              }
              renderItem={renderBodegaItem}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <Text style={styles.noResultsText}>
                  No se encontraron bodegas
                </Text>
              }
            />
          </View>
        )}
      </View>

      <FilterConfirmButton applyFilters={handleSubmit(onSubmit)} />
    </FilterModal>
  );
}

const styles = StyleSheet.create({
  modalHeader: {
    alignItems: "center",
    marginBottom: 30,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  filterSection: {
    marginBottom: 30,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  filterInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  filterInputText: {
    fontSize: 16,
    color: "#333",
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginTop: 8,
    maxHeight: 200,
  },
  pickerOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  pickerOptionText: {
    fontSize: 16,
    color: "#333",
  },
  priceRangeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  priceInputContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  priceInput: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    fontSize: 16,
    color: "#333",
  },
  inputError: {
    borderColor: "#ff4444",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 14,
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 8,
  },
  searchInput: {
    fontSize: 14,
    color: "#333",
    padding: 0,
  },
  noResultsText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    paddingVertical: 10,
  },
});
