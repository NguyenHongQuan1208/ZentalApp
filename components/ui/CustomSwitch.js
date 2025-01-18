import React, { useState, useRef } from "react";
import { View, TouchableOpacity, Animated, StyleSheet } from "react-native";
import { GlobalColors } from "../../constants/GlobalColors";

function CustomSwitch({ isOn, onToggle }) {
  const translateX = useRef(new Animated.Value(isOn ? 25 : 0)).current;

  // Hàm xử lý bật/tắt nút gạt
  function toggleSwitch() {
    const toValue = isOn ? 0 : 25; // Di chuyển nút gạt
    Animated.timing(translateX, {
      toValue,
      duration: 200, // Thời gian chuyển động
      useNativeDriver: true,
    }).start();
    onToggle(); // Gọi callback để cập nhật trạng thái bên ngoài
  }

  return (
    <TouchableOpacity style={styles.switchContainer} onPress={toggleSwitch}>
      <View style={[styles.switchTrack, isOn && styles.switchTrackActive]} />
      <Animated.View
        style={[styles.switchThumb, { transform: [{ translateX }] }]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  switchContainer: {
    width: 50,
    height: 30,
    justifyContent: "center",
    borderRadius: 15,
    position: "relative",
  },
  switchTrack: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#ccc",
    borderRadius: 15,
  },
  switchTrackActive: {
    backgroundColor: GlobalColors.primaryColor,
  },
  switchThumb: {
    width: 25,
    height: 25,
    backgroundColor: "#fff",
    borderRadius: 12.5,
    elevation: 3, // Hiệu ứng đổ bóng cho Android
    shadowColor: "#000", // Hiệu ứng đổ bóng cho iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
});

export default CustomSwitch;
