import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";

const StartButton = ({ onPress }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.startButton,
        pressed && styles.startButtonPressed,
      ]}
      onPress={onPress}
    >
      <Text style={styles.startButtonText}>Start</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  startButton: {
    backgroundColor: "transparent",
    borderRadius: 10,
    borderColor: "#fff",
    borderWidth: 1,
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  startButtonPressed: {
    opacity: 0.5,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default StartButton;
