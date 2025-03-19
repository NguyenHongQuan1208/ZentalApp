import React from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { GlobalColors } from "../../constants/GlobalColors";

const LoadingPlaceholder = () => {
  return (
    <View style={styles.placeholderContainer}>
      <View style={styles.swirlContainer}>
        <ActivityIndicator
          size="large"
          color={GlobalColors.primaryColor}
          style={styles.spinner}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  placeholderContainer: {
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF", // Màu trắng
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  swirlContainer: {
    width: "100%",
    minHeight: 520,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#FFFFFF", // Màu trắng
    overflow: "hidden",
  },
  spinner: {
    transform: [{ scale: 1.5 }],
  },
});

export default LoadingPlaceholder;
