import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { GlobalColors } from "../../constants/GlobalColors";
import { useTranslation } from "react-i18next";

const ConfirmationDialog = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation();
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.dialogContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>{t("Cancel")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  dialogContainer: {
    width: "85%",
    maxWidth: 340,
    padding: 24,
    backgroundColor: GlobalColors.pureWhite,
    borderRadius: 16,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: "#1a1a1a",
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
    color: "#4a4a4a",
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  confirmButton: {
    backgroundColor: GlobalColors.primaryColor,
  },
  cancelButtonText: {
    color: "#666666",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButtonText: {
    color: GlobalColors.pureWhite,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ConfirmationDialog;
