import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, Pressable } from "react-native";
import Button from "../ui/Button";
import { GlobalColors } from "../../constants/GlobalColors";
import { Ionicons } from "@expo/vector-icons";
import LongButton from "../ui/LongButton";
import { useNavigation } from "@react-navigation/native";
import DescribeBox from "./DescribeBox";
import { useTranslation } from "react-i18next";

function DecisionBox({
  id,
  color,
  icon,
  description,
  target,
  placeholderQuestion,
}) {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  // console.log(description);
  function startHandler() {
    navigation.navigate("TaskNote", {
      id: id,
      color: color,
      icon: icon,
      target: target,
      placeholderQuestion: placeholderQuestion,
    });
    setModalVisible(false);
  }
  return (
    <View>
      <Pressable
        style={[styles.box, { backgroundColor: color }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.boxText}>{t("You decide How")}</Text>
      </Pressable>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View
              style={[styles.iconTextContainer, { borderBottomColor: color }]}
            >
              <Ionicons name="bulb" size={18} color={color} />
              <Text style={[styles.modalText, { color: color }]}>
                {t("This is your decision!")}
              </Text>
            </View>
            <DescribeBox color={color} description={description} />
            <LongButton
              onPress={startHandler}
              style={{ backgroundColor: color, marginBottom: 8 }}
            >
              {t("start")}
            </LongButton>
            <Button onPress={() => setModalVisible(false)}>{t("close")}</Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default DecisionBox;

const styles = StyleSheet.create({
  box: {
    padding: 8,
    borderRadius: 20,
    margin: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  boxText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // Màu nền mờ
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: GlobalColors.pureWhite,
    borderWidth: 2,
    borderColor: GlobalColors.primaryColor,
    padding: 20,
    borderRadius: 20,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  iconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 8,
    borderBottomWidth: 2,
  },
  modalText: {
    marginLeft: 4,
    fontSize: 18,
    fontWeight: "bold",
  },
});
