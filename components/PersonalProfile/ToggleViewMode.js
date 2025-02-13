import React from "react";
import { Pressable, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types"; // For prop validation
import { GlobalColors } from "../../constants/GlobalColors";

const ToggleViewMode = ({ viewMode, setViewMode, style }) => {
  const modes = [
    { mode: "grid", icon: "grid-outline", label: "Grid View" },
    { mode: "list", icon: "image-sharp", label: "List View" },
  ];

  return (
    <View style={[styles.toggleContainer, style]}>
      {modes.map(({ mode, icon, label }) => (
        <Pressable
          key={mode}
          style={({ pressed }) => [
            styles.toggleButton,
            mode === "grid" && { borderRightWidth: 2 },
            pressed && styles.pressed,
          ]}
          onPress={() => setViewMode(mode)}
          accessibilityLabel={label}
          accessibilityRole="button"
        >
          <Ionicons
            name={icon}
            size={20}
            color={
              viewMode === mode
                ? GlobalColors.primaryColor
                : GlobalColors.inActivetabBarColor
            }
          />
        </Pressable>
      ))}
    </View>
  );
};

// Prop validation
ToggleViewMode.propTypes = {
  viewMode: PropTypes.oneOf(["grid", "list"]).isRequired,
  setViewMode: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: GlobalColors.pureWhite,
  },
  toggleButton: {
    flex: 1,
    padding: 6, // Slightly increased padding for better touch area
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GlobalColors.pureWhite,
    borderColor: GlobalColors.primaryColor,
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  pressed: {
    opacity: 0.7, // Visual feedback when pressed
  },
});

export default ToggleViewMode;
