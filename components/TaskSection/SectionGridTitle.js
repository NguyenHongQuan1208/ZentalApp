import { Pressable, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlobalColors } from "../../constants/GlobalColors";

function SectionGridTitle({ title, color, onPress, icon, hasDraft }) {
  return (
    <View style={styles.gridItem}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.pressable,
          pressed && styles.buttonPressed,
        ]}
      >
        <View style={[styles.iconWrapper, { backgroundColor: color }]}>
          <Ionicons name={icon} size={35} color="white" />
          {hasDraft && (
            <View style={styles.draftIcon}>
              <Ionicons
                name="pencil"
                size={14}
                color={GlobalColors.thirdColor}
              />
            </View>
          )}
        </View>
        <Text style={styles.title}>{title}</Text>
      </Pressable>
    </View>
  );
}
export default SectionGridTitle;

const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    alignItems: "center",
    margin: 10,
  },
  pressable: {
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.5,
  },
  iconWrapper: {
    width: 86, // Reduced width for smaller circular icon
    height: 86, // Reduced height for smaller circular icon
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 43, // Half of the width/height for a perfect circle
    position: "relative", // To support absolute positioning for draftIcon
  },
  draftIcon: {
    position: "absolute",
    bottom: -5, // Position at the bottom right corner
    right: -5,
    backgroundColor: GlobalColors.primaryWhite, // Darker background for visibility
    borderRadius: 12,
    borderWidth: 2,
    borderColor: GlobalColors.thirdColor,
    padding: 2,
  },
  title: {
    marginTop: 8,
    fontSize: 14, // Font size for the title
    fontWeight: "bold",
    textAlign: "center",
    color: GlobalColors.secondBlack,
  },
});
