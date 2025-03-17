import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { GlobalColors } from "../../constants/GlobalColors";

const ToggleButtons = ({ showFollowing, onToggle }) => {
  return (
    <View style={styles.toggleContainer}>
      <View style={styles.toggleWrapper}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            !showFollowing && styles.activeButton,
            { borderRightWidth: 1, borderRightColor: GlobalColors.lightGray },
          ]}
          onPress={() => onToggle(false)}
        >
          <Text
            style={[
              styles.toggleButtonText,
              !showFollowing && styles.activeButtonText,
            ]}
          >
            All Users
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, showFollowing && styles.activeButton]}
          onPress={() => onToggle(true)}
        >
          <Text
            style={[
              styles.toggleButtonText,
              showFollowing && styles.activeButtonText,
            ]}
          >
            Following Users
          </Text>
        </TouchableOpacity>
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
