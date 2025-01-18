import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlobalColors } from "../../constants/GlobalColors";

function EmotionButton({ emotion, isSelected, onSelect }) {
  return (
    <TouchableOpacity style={styles.emotionButton} onPress={onSelect}>
      <Ionicons
        name={emotion.icon}
        size={45} // Phóng to icon
        color={
          isSelected
            ? GlobalColors.primaryColor
            : GlobalColors.inActivetabBarColor
        } // Màu khi được chọn
      />
      <Text
        style={[
          styles.emotionLabel,
          isSelected && { color: GlobalColors.primaryColor }, // Màu text khi được chọn
        ]}
      >
        {emotion.label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  emotionButton: {
    alignItems: "center",
    paddingHorizontal: 10,
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "transparent", // Bỏ viền
  },
  emotionLabel: {
    marginTop: 5,
    fontSize: 16,
    color: GlobalColors.primaryBlack, // Màu xám ban đầu
  },
});

export default EmotionButton;
