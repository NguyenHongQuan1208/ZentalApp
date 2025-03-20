import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { GlobalColors } from "../../constants/GlobalColors";

const ToggleButtons = ({ activeTab, onToggle, options }) => {
  return (
    <View style={styles.toggleContainer}>
      <View style={styles.toggleWrapper}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.toggleButton,
              activeTab === option.value && styles.activeButton,
              option.value !== options[0].value && {
                borderLeftWidth: 1,
                borderLeftColor: GlobalColors.lightGray,
              },
            ]}
            onPress={() => onToggle(option.value)}
          >
            <Text
              style={[
                styles.toggleButtonText,
                activeTab === option.value && styles.activeButtonText,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    marginTop: 8,
    marginHorizontal: 16,
    marginBottom: 4,
  },
  toggleWrapper: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 16,
    borderColor: GlobalColors.lightGray,
    overflow: "hidden",
  },
  toggleButton: {
    flex: 1,
    height: 30, // Reduced height
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GlobalColors.pureWhite, // Keep background the same
  },
  toggleButtonText: {
    fontSize: 14,
    color: GlobalColors.lightGray,
    fontWeight: "500",
  },
  activeButtonText: {
    color: GlobalColors.primaryColor, // Change text color when active
  },
});

export default ToggleButtons;
