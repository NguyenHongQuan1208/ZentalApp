import { Pressable, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { GlobalColors } from "../../constants/GlobalColors";

const FilterButton = ({ onPress }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.filterButton,
        pressed && styles.buttonPressed,
      ]}
      android_ripple={{ color: "#ccc" }}
      onPress={onPress}
    >
      <Ionicons
        name="funnel-outline"
        size={20}
        color={GlobalColors.pureWhite}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    backgroundColor: GlobalColors.primaryColor,
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    marginLeft: 3,
  },
  buttonPressed: {
    opacity: 0.7,
  },
});

export default FilterButton;
