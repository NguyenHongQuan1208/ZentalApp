import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { GlobalColors } from "../../constants/GlobalColors";

const ToggleButtons = ({ activeTab, onToggle }) => {
  return (
    <View style={styles.toggleContainer}>
      <View style={styles.toggleWrapper}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            activeTab === "All" && styles.activeButton,
            { borderRightWidth: 1, borderRightColor: GlobalColors.lightGray },
          ]}
          onPress={() => onToggle("All")}
        >
          <Text
            style={[
              styles.toggleButtonText,
              activeTab === "All" && styles.activeButtonText,
            ]}
          >
            All Users
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            activeTab === "Recent" && styles.activeButton,
            { borderRightWidth: 1, borderRightColor: GlobalColors.lightGray },
          ]}
          onPress={() => onToggle("Recent")}
        >
          <Text
            style={[
              styles.toggleButtonText,
              activeTab === "Recent" && styles.activeButtonText,
            ]}
          >
            Recently
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            activeTab === "Following" && styles.activeButton,
          ]}
          onPress={() => onToggle("Following")}
        >
          <Text
            style={[
              styles.toggleButtonText,
              activeTab === "Following" && styles.activeButtonText,
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
