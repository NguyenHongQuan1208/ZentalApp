import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { GlobalColors } from "../../constants/GlobalColors";

const CommentButton = ({ commentCount, onPress }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.iconButton,
        pressed && styles.pressedButton,
      ]}
      onPress={onPress}
    >
      <Ionicons
        name="chatbubble-outline"
        size={24}
        color={GlobalColors.inActivetabBarColor}
      />
      <Text style={styles.iconText}>{commentCount}</Text>
    </Pressable>
  );
};

export default CommentButton;

const styles = StyleSheet.create({
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
    padding: 4,
  },
  pressedButton: {
    opacity: 0.7,
  },
  iconText: {
    marginLeft: 6,
    fontSize: 15,
    color: GlobalColors.inActivetabBarColor,
  },
});
