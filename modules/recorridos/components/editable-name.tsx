import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/colors";
import { FontWeights, Spacing } from "@/constants/spacing";
import { appEvents } from "@/lib/app-events";
import { ApiError } from "@/lib/error";
import { updateRecorridoName } from "@/modules/recorridos/api";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Toast } from "toastify-react-native";

interface EditableNameProps {
  name: string;
  recorridoId: number;
  onNameUpdate: (newName: string) => void;
  canEdit?: boolean;
}

export function EditableName({
  name,
  recorridoId,
  onNameUpdate,
  canEdit = true,
}: EditableNameProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = () => {
    if (!canEdit) return;
    setIsEditing(true);
    setEditName(name);
  };

  const handleSave = async () => {
    if (editName.trim() === name.trim()) {
      setIsEditing(false);
      return;
    }

    if (!editName.trim()) {
      Toast.show({
        type: "error",
        text1: "El nombre no puede estar vacío",
      });
      return;
    }

    setIsLoading(true);
    try {
      await updateRecorridoName(recorridoId, editName.trim());
      onNameUpdate(editName.trim());
      // Emitir evento para revalidar data en otras tabs
      appEvents.emit("recorrido:name-updated", {
        recorridoId,
        newName: editName.trim(),
      });
      setIsEditing(false);
      Toast.show({
        type: "success",
        text1: "Nombre actualizado",
      });
    } catch (error) {
      const errorData = error as unknown as ApiError;
      Toast.show({
        type: "error",
        text1: "Error al actualizar nombre",
        text2: errorData.message,
      });
      console.error("Error updating recorrido name:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditName(name);
  };

  if (isEditing) {
    return (
      <View style={styles.editContainer}>
        <TextInput
          style={styles.textInput}
          value={editName}
          onChangeText={setEditName}
          placeholder="Nombre del recorrido"
          autoFocus
          editable={!isLoading}
        />
        <View style={styles.editButtons}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            disabled={isLoading}
          >
            <IconSymbol
              name="xmark"
              size={16}
              color={Colors.light.text.secondary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={isLoading || !editName.trim()}
          >
            <IconSymbol name="checkmark" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.nameContainer}>
      <Text style={styles.nameText}>{name}</Text>
      {canEdit && (
        <TouchableOpacity style={styles.editIcon} onPress={handleEdit}>
          <IconSymbol
            name="pencil"
            size={16}
            color={Colors.light.text.secondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  nameText: {
    fontSize: 20,
    fontWeight: FontWeights.bold,
    color: Colors.light.text.primary,
    flex: 1,
  },
  editIcon: {
    padding: Spacing.xs,
  },
  editContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  textInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: FontWeights.bold,
    color: Colors.light.text.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.primary,
    paddingVertical: Spacing.xs,
  },
  editButtons: {
    flexDirection: "row",
    gap: Spacing.xs,
  },
  cancelButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.gray.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
  },
});
