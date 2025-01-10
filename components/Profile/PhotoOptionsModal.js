import React from "react";
import { View, Text, StyleSheet, Modal, Pressable } from "react-native";
import { GlobalColors } from "../../constants/GlobalColors";
import { Ionicons } from "@expo/vector-icons"; // Import Icon

function PhotoOptionsModal({
  visible,
  onClose,
  onTakePhoto,
  onSelectPhoto,
  onDeletePhoto,
}) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.buttonRow}>
            {/* Take Photo */}
            <Pressable style={styles.actionButton} onPress={onTakePhoto}>
              <Ionicons
                name="camera"
                size={24}
                color={GlobalColors.thirdColor}
              />
              <Text style={styles.buttonText}>Take Photo</Text>
            </Pressable>

            {/* Select Photo */}
            <Pressable style={styles.actionButton} onPress={onSelectPhoto}>
              <Ionicons
                name="images"
                size={24}
                color={GlobalColors.thirdColor}
              />
              <Text style={styles.buttonText}>Select</Text>
            </Pressable>

            {/* Delete Photo */}
            <Pressable style={styles.actionButton} onPress={onDeletePhoto}>
              <Ionicons
                name="trash"
                size={24}
                color={GlobalColors.thirdColor}
              />
              <Text style={styles.buttonText}>Delete</Text>
            </Pressable>

            {/* Cancel */}
            <Pressable style={styles.actionButton} onPress={onClose}>
              <Ionicons
                name="close"
                size={24}
                color={GlobalColors.thirdColor}
              />
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default PhotoOptionsModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    width: "90%",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between", // Cách đều các nút
    alignItems: "center",
  },
  actionButton: {
    flex: 1, // Các nút chiếm kích thước bằng nhau trong hàng ngang
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: GlobalColors.primaryGrey,
    marginHorizontal: 5, // Khoảng cách ngang giữa các nút
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: GlobalColors.thirdColor,
    height: 80, // Đảm bảo chiều cao đồng nhất
  },
  buttonText: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "bold",
    color: GlobalColors.primaryBlack,
    textAlign: "center",
  },
});
