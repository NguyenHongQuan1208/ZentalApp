import React, { useRef } from "react";
import { View, Text, Pressable, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlobalColors } from "../../constants/GlobalColors";
import { useNavigation } from "@react-navigation/native";

function MenuItem({ icon, screenName, screen }) {
  const navigation = useNavigation();
  const opacity = useRef(new Animated.Value(1)).current;

  function pressHandler() {
    // Thực hiện hiệu ứng fade
    Animated.timing(opacity, {
      toValue: 0.5,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      // Sau khi hoàn tất hiệu ứng, điều hướng tới trang khác
      navigation.navigate(screen);

      // Đặt lại opacity
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  }

  return (
    <Pressable
      onPress={pressHandler}
      style={({ pressed }) => [pressed && styles.pressed]}
    >
      <Animated.View style={[styles.menuItem, { opacity }]}>
        <Ionicons name={icon} size={20} color={GlobalColors.primaryBlack} />
        <Text style={styles.menuText}>{screenName}</Text>
      </Animated.View>
    </Pressable>
  );
}

export default MenuItem;

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: GlobalColors.primaryGrey,
    paddingHorizontal: 10,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
    color: GlobalColors.primaryBlack,
    fontWeight: "500",
  },
  pressed: {
    opacity: 0.5,
  },
});
