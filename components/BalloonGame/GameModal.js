import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { GlobalColors } from "../../constants/GlobalColors";

const GameModal = ({ visible, message, onClose, buttonText }) => {
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>{message}</Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Tăng độ mờ của background
  },
  modalContent: {
    width: 300,
    padding: 25,
    borderRadius: 20,
    backgroundColor: "white",
    alignItems: "center",
    // Thêm shadow cho modal
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    color: "#333", // Màu text tối hơn
    lineHeight: 28, // Thêm line-height để text dễ đọc hơn
  },
  startButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: GlobalColors.primaryColor,
    borderRadius: 10,
    // Thêm shadow cho button
    shadowColor: GlobalColors.primaryColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  startButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase", // Chữ in hoa
    letterSpacing: 1, // Tăng khoảng cách giữa các chữ
  },
});

export default GameModal;
