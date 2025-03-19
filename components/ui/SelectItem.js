import React from "react";
import { Text, Pressable, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlobalColors } from "../../constants/GlobalColors";

function SelectItem({ icon, itemName, userId, onPress }) {
  const opacity = React.useRef(new Animated.Value(1)).current;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [pressed && styles.pressed]}
    >
      <Animated.View style={[styles.selectItem, { opacity }]}>
        <Ionicons name={icon} size={20} color={GlobalColors.primaryBlack} />
        <Text style={styles.itemText}>{itemName}</Text>
      </Animated.View>
    </Pressable>
  );
}

export default SelectItem;

const styles = StyleSheet.create({
  selectItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: GlobalColors.primaryGrey,
    paddingHorizontal: 10,
  },
  itemText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "500",
    color: GlobalColors.primaryBlack,
  },
  pressed: {
    opacity: 0.5,
  },
});
