import { Modal, Text, View } from "react-native";

export const BookingConfirmationModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      transparent
    >
      <View>
        <Text>Confirmación de reserva</Text>
      </View>
    </Modal>
  );
};
