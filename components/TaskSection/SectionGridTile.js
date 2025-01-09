import { Pressable, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlobalColors } from "../../constants/GlobalColors";

function SectionGridTile({ title, color, onPress, icon }) {
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
          <Ionicons name={icon} size={34} color="white" />
        </View>
        <Text style={styles.title}>{title}</Text>
      </Pressable>
    </View>
  );
}
export default SectionGridTile;

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
    width: 75,
    height: 75,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  title: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: GlobalColors.secondBlack,
  },
});
