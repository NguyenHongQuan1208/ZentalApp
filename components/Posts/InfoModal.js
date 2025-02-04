// InfoModal.js
import React from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { GlobalColors } from "../../constants/GlobalColors";

const InfoModal = ({ visible, onClose, content }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View
          style={[
            styles.modalView,
            { backgroundColor: GlobalColors.primaryWhite },
          ]}
        >
          <Text style={styles.modalText}>{content}</Text>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text>Close</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalView: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "100%",
    height: "66%", // Occupy 2/3 of the screen height
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default InfoModal;
